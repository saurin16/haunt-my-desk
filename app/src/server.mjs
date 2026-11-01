import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';
import { initialState, enqueue, takeNext, setCandidate, useFallback, approve, finish, setAnchor, setEnabled } from './engine.mjs';
import { prepareChallenge, configuredAgentMode } from './agents.mjs';
import { TwitchChat } from './twitch.mjs';

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(appDir, 'public');
const dataDir = path.join(appDir, '.local');
const dataFile = path.join(dataDir, 'state.json');
const port = Number(process.env.PORT || 3000);
const baseUrl = process.env.PUBLIC_BASE_URL || `http://localhost:${port}`;
const clientId = process.env.TWITCH_CLIENT_ID || '';
const adminToken = process.env.ADMIN_TOKEN || crypto.randomBytes(24).toString('hex');
let saved = {};
try { saved = JSON.parse(fs.readFileSync(dataFile, 'utf8')); } catch { /* first run */ }
const state = initialState(saved);
state.agentMode = configuredAgentMode();
const authStates = new Map();
const clients = new Set();
const audit = [];

function record(type, detail) {
  audit.unshift({ at: Date.now(), type, detail });
  audit.length = Math.min(audit.length, 40);
}

function persist() {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify({ objects: state.objects, history: state.history }, null, 2));
}

function publicState() {
  return { ...state, audit, catalogMode: configuredAgentMode(), liveChatAt: twitch.lastMessageAt || null };
}

function broadcast() {
  const message = JSON.stringify({ type: 'state', state: publicState() });
  for (const client of clients) if (client.readyState === 1) client.send(message);
  persist();
}

const twitch = new TwitchChat({
  clientId,
  onChat: (chat) => {
    const result = enqueue(state, chat);
    record('twitch_message', result.accepted ? `Queued ${chat.text} from ${chat.user}` : `Ignored: ${result.reason}`);
    if (result.accepted) console.log(`Twitch command: ${chat.user} ${chat.text} id=${chat.id} event-to-queue=${Math.max(0, Date.now() - chat.timestamp)}ms`);
    broadcast();
  },
  onStatus: (status) => { state.twitch = status; record('twitch_status', `${status.status}${status.error ? `: ${status.error}` : ''}`); broadcast(); },
});

function json(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify(body));
}

async function readJson(request) {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 20000) throw new Error('Request too large');
  }
  return body ? JSON.parse(body) : {};
}

function isAdmin(request) {
  return request.headers['x-admin-token'] === adminToken;
}

const routes = {
  '/': 'index.html',
  '/overlay': 'overlay.html',
  '/showcase': 'showcase.html',
  '/auth/callback': 'auth.html',
};
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' };

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, baseUrl);
  try {
    if (request.method === 'GET' && url.pathname === '/api/state') return json(response, 200, publicState());
    if (request.method === 'GET' && url.pathname === '/api/config') return json(response, 200, { twitchConfigured: Boolean(clientId), modelConfigured: Boolean(process.env.OPENAI_API_KEY), baseUrl });
    if (request.method === 'POST') {
      if (url.pathname === '/api/twitch/token') {
        const body = await readJson(request);
        const expiry = authStates.get(body.state);
        authStates.delete(body.state);
        if (!expiry || expiry < Date.now()) return json(response, 403, { error: 'OAuth state expired or invalid' });
        const user = await twitch.authorize(String(body.token || ''));
        record('twitch_authorized', `Connected channel ${user.login}`);
        broadcast();
        return json(response, 200, { channel: user.login });
      }
      if (!isAdmin(request)) return json(response, 403, { error: 'Host access required' });
      const body = await readJson(request);
      if (url.pathname === '/api/auth/start') {
        if (!clientId) return json(response, 400, { error: 'Set TWITCH_CLIENT_ID first' });
        const stateId = crypto.randomBytes(20).toString('hex');
        authStates.set(stateId, Date.now() + 5 * 60_000);
        const authorize = new URL('https://id.twitch.tv/oauth2/authorize');
        authorize.searchParams.set('response_type', 'token');
        authorize.searchParams.set('client_id', clientId);
        authorize.searchParams.set('redirect_uri', new URL('/auth/callback', baseUrl).toString());
        authorize.searchParams.set('scope', 'user:read:chat');
        authorize.searchParams.set('state', stateId);
        return json(response, 200, { url: authorize.toString() });
      }
      if (url.pathname === '/api/command') {
        const result = enqueue(state, { id: null, user: body.user || 'demo_viewer', text: body.text, source: 'demo' });
        record('demo_command', result.accepted ? String(body.text) : `Ignored: ${result.reason}`);
        broadcast();
        return json(response, result.accepted ? 200 : 400, result);
      }
      if (url.pathname === '/api/anchor') {
        const item = setAnchor(state, String(body.id), body.x, body.y);
        broadcast();
        return json(response, 200, item);
      }
      if (url.pathname === '/api/object') {
        const item = setEnabled(state, String(body.id), body.enabled);
        broadcast();
        return json(response, 200, item);
      }
      if (url.pathname === '/api/next') {
        const round = takeNext(state);
        if (!round) return json(response, 409, { error: 'Queue empty or a round is active' });
        broadcast();
        const proposal = await prepareChallenge(round.objectId);
        setCandidate(state, proposal);
        record('challenge_review', `${round.objectId}: ${proposal.mode}; ${proposal.referee.approved ? 'approved for host' : 'vetoed'}; ${proposal.referee.reason}`);
        broadcast();
        return json(response, 200, state.current);
      }
      if (url.pathname === '/api/fallback') {
        const round = useFallback(state);
        record('fallback', `${round.objectId}: host chose authored catalog fallback`);
        broadcast();
        return json(response, 200, round);
      }
      if (url.pathname === '/api/approve') {
        const round = approve(state);
        record('host_approval', `${round.objectId} by ${round.user}`);
        console.log(`Approved round ${round.id}; overlay state broadcast`);
        broadcast();
        return json(response, 200, round);
      }
      if (url.pathname === '/api/finish') {
        const round = finish(state, String(body.result));
        record('round_result', `${round.objectId} ${round.status} by ${round.user}`);
        broadcast();
        return json(response, 200, round);
      }
      if (url.pathname === '/api/disconnect') {
        twitch.stop();
        return json(response, 200, { ok: true });
      }
      return json(response, 404, { error: 'Unknown API route' });
    }
    if (request.method !== 'GET') return json(response, 405, { error: 'Method not allowed' });
    const relative = routes[url.pathname] || (url.pathname.startsWith('/assets/') ? url.pathname.slice(1) : null);
    if (!relative) return json(response, 404, { error: 'Not found' });
    const filePath = path.resolve(publicDir, relative);
    if (!filePath.startsWith(publicDir + path.sep)) return json(response, 403, { error: 'Forbidden' });
    const data = fs.readFileSync(filePath);
    response.writeHead(200, { 'Content-Type': mime[path.extname(filePath)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    return response.end(data);
  } catch (error) {
    console.error(error.message);
    return json(response, 400, { error: error.message });
  }
});

const wss = new WebSocketServer({ noServer: true });
server.on('upgrade', (request, socket, head) => {
  if (new URL(request.url, baseUrl).pathname !== '/ws') return socket.destroy();
  wss.handleUpgrade(request, socket, head, (client) => {
    clients.add(client);
    client.send(JSON.stringify({ type: 'state', state: publicState() }));
    client.on('close', () => clients.delete(client));
  });
});

server.listen(port, () => {
  console.log(`Haunt My Desk: ${baseUrl}`);
  console.log(`Host controls: ${baseUrl}/#admin=${adminToken}`);
  console.log(`OBS overlay: ${baseUrl}/overlay`);
  console.log(`Showcase: ${baseUrl}/showcase`);
  console.log(`Twitch app: ${clientId ? 'configured' : 'set TWITCH_CLIENT_ID in .env'}`);
  console.log(`Challenge mode: ${configuredAgentMode()}`);
});

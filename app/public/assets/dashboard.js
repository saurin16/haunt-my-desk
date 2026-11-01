const $ = (id) => document.getElementById(id);
const adminFromHash = new URLSearchParams(location.hash.slice(1)).get('admin');
if (adminFromHash) {
  sessionStorage.setItem('haunt_admin', adminFromHash);
  history.replaceState(null, '', '/');
}
const admin = sessionStorage.getItem('haunt_admin');
let snapshot = null;
let selectedObject = 'mug';
let cameraStream = null;

function node(tag, className = '', text = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function showError(message) {
  $('error').textContent = message;
  $('error').classList.remove('hidden');
  setTimeout(() => $('error').classList.add('hidden'), 7000);
}

async function post(path, payload = {}) {
  if (!admin) return showError('Host access is required. Open the private URL printed by the server.');
  const response = await fetch(`/api/${path}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-token': admin }, body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Request failed');
  return result;
}

async function act(path, payload = {}) {
  try { await post(path, payload); } catch (error) { showError(error.message); }
}

function renderObjects(state) {
  const list = $('objects');
  list.replaceChildren();
  const layer = $('anchor-layer');
  layer.replaceChildren();
  for (const object of Object.values(state.objects)) {
    const row = node('div', `object-row ${selectedObject === object.id ? 'selected' : ''} ${object.enabled ? '' : 'disabled'}`);
    const select = node('button', 'object-select');
    select.type = 'button';
    select.append(node('span', 'object-icon', object.icon), node('strong', '', object.label), node('small', '', `!haunt ${object.id}`));
    select.onclick = () => { selectedObject = object.id; renderObjects(snapshot); };
    const toggle = node('button', 'object-toggle', object.enabled ? 'ON' : 'OFF');
    toggle.type = 'button';
    toggle.setAttribute('aria-label', `${object.enabled ? 'Disable' : 'Enable'} ${object.label}`);
    toggle.disabled = !admin;
    toggle.onclick = () => act('object', { id: object.id, enabled: !object.enabled });
    row.append(select, toggle);
    list.append(row);
    if (object.enabled) {
      const pin = node('div', `anchor-pin ${selectedObject === object.id ? 'active' : ''}`, object.icon);
      pin.style.left = `${object.x * 100}%`;
      pin.style.top = `${object.y * 100}%`;
      pin.style.setProperty('--pin-color', object.accent);
      pin.title = `${object.label} anchor`;
      layer.append(pin);
    }
  }
}

function button(label, onClick, className = 'button primary') {
  const element = node('button', className, label);
  element.type = 'button';
  element.disabled = !admin;
  element.onclick = onClick;
  return element;
}

function renderRound(state) {
  const box = $('current-round');
  box.replaceChildren();
  const round = state.current;
  box.className = `current-round ${round ? round.status : 'empty'}`;
  if (!round) {
    box.append(node('div', 'empty-symbol', '✧'), node('strong', '', 'Waiting for a curse'), node('p', '', 'A viewer command will arrive here. You control what goes live.'));
    return;
  }
  const top = node('div', 'round-top');
  top.append(node('span', 'source-tag', round.source === 'twitch' ? '● REAL TWITCH CHAT' : '◇ SIMULATED COMMAND'), node('span', 'round-status', round.status.replaceAll('_', ' ').toUpperCase()));
  const title = node('h3', '', `${state.objects[round.objectId].icon} ${state.objects[round.objectId].label}`);
  const caster = node('p', 'caster', `Cast by ${round.user}`);
  box.append(top, title, caster);
  if (round.status === 'preparing') {
    box.append(node('p', 'review-note', 'Preparing a catalog challenge and review…'));
  } else if (round.challenge) {
    box.append(node('p', 'challenge-copy', round.challenge.text));
    const review = node('div', 'review');
    review.append(node('span', 'review-mode', round.agentMode === 'two-agent' ? 'TWO AGENTS' : 'AUTHORED CATALOG'));
    const ranAgents = round.agentMode === 'two-agent';
    if (round.maker) review.append(node('p', '', `${ranAgents ? 'Challenge Maker' : 'Authored challenge'}: ${round.maker.reason}`));
    if (round.referee) review.append(node('p', round.referee.approved ? 'approved' : 'vetoed', `${ranAgents ? 'Safety Referee' : 'Catalog check'}: ${round.referee.reason}`));
    if (round.veto) review.append(node('p', 'vetoed', `Earlier Safety Referee veto: ${round.veto.referee.reason}`));
    box.append(review);
    const actions = node('div', 'round-actions');
    if (round.status === 'vetoed' && round.fallbackAvailable) actions.append(button('Use safe fallback', () => act('fallback')));
    if (round.status === 'awaiting_approval') actions.append(button('Approve & cast spell →', () => act('approve')));
    if (round.status === 'live') {
      actions.append(button('✓ Spell broken', () => act('finish', { result: 'success' })));
      actions.append(button('✕ Time ran out', () => act('finish', { result: 'failure' }), 'button subtle'));
    }
    actions.append(button('Skip', () => act('finish', { result: 'skipped' }), 'button ghost'));
    box.append(actions);
  }
}

function renderQueue(state) {
  $('queue-count').textContent = `${state.queue.length} queued`;
  $('next-btn').disabled = !admin || Boolean(state.current) || state.queue.length === 0;
  const list = $('queue-list');
  list.replaceChildren();
  for (const entry of state.queue) {
    const item = node('div', 'queue-item');
    item.append(node('span', 'queue-icon', state.objects[entry.objectId].icon), node('strong', '', entry.user), node('code', '', `!haunt ${entry.objectId}`), node('small', '', entry.source === 'twitch' ? 'TWITCH' : 'DEMO'));
    list.append(item);
  }
}

function renderHistory(state) {
  $('stat-received').textContent = state.counters.received;
  $('stat-completed').textContent = state.counters.completed;
  $('stat-ignored').textContent = state.counters.ignored;
  const list = $('history-list');
  list.replaceChildren();
  if (!state.history.length) return list.append(node('p', 'muted', 'No rounds yet.'));
  for (const round of state.history.slice(0, 5)) {
    const row = node('div', 'history-row');
    row.append(node('span', `history-result ${round.status}`, round.status === 'success' ? '✦' : '◇'), node('strong', '', `${state.objects[round.objectId].label} · ${round.user}`), node('small', '', round.status.toUpperCase()));
    list.append(row);
  }
}

function render(state) {
  snapshot = state;
  $('mode-chip').textContent = state.catalogMode === 'two-agent' ? 'TWO-AGENT MODE' : 'AUTHORED MODE';
  $('twitch-chip').className = `chip ${state.twitch.status}`;
  $('twitch-chip').innerHTML = '<i></i>';
  $('twitch-chip').append(document.createTextNode(state.twitch.status === 'connected' ? ` LIVE: ${state.twitch.channel}` : ` TWITCH ${state.twitch.status.toUpperCase()}`));
  $('connect-btn').textContent = state.twitch.status === 'connected' ? 'Connected ✓' : 'Connect Twitch ↗';
  $('connect-btn').disabled = !admin || state.twitch.status === 'connected';
  renderObjects(state); renderRound(state); renderQueue(state); renderHistory(state);
}

const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
let socket;
function openSocket() {
  socket = new WebSocket(`${protocol}//${location.host}/ws`);
  socket.onmessage = (event) => {
    const packet = JSON.parse(event.data);
    if (packet.type === 'state') render(packet.state);
  };
  socket.onclose = () => setTimeout(openSocket, 1500);
}
openSocket();

fetch('/api/config').then((response) => response.json()).then((config) => {
  $('overlay-url').textContent = `${config.baseUrl}/overlay`;
  if (!config.twitchConfigured) $('connect-btn').title = 'Set TWITCH_CLIENT_ID in .env, then restart';
});
if (!admin) $('public-note').classList.remove('hidden');

$('camera-btn').onclick = async () => {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
    $('camera-video').srcObject = null;
    $('camera-map').classList.remove('camera-on');
    $('camera-btn').textContent = 'Start camera preview';
    return;
  }
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: false });
    $('camera-video').srcObject = cameraStream;
    $('camera-map').classList.add('camera-on');
    $('camera-btn').textContent = 'Stop camera preview';
  } catch (error) { showError(`Camera unavailable: ${error.message}`); }
};
$('camera-map').onclick = (event) => {
  if (!admin || event.target.closest('button')) return;
  const rect = $('camera-map').getBoundingClientRect();
  act('anchor', { id: selectedObject, x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height });
};
$('connect-btn').onclick = async () => {
  try { const result = await post('auth/start'); location.href = result.url; } catch (error) { showError(error.message); }
};
$('copy-btn').onclick = async () => {
  try { await navigator.clipboard.writeText($('overlay-url').textContent); $('copy-btn').textContent = 'Copied ✓'; setTimeout(() => $('copy-btn').textContent = 'Copy', 1500); }
  catch (error) { showError(error.message); }
};
$('next-btn').onclick = () => act('next');
$('demo-btn').onclick = () => act('command', { user: $('demo-user').value, text: `!haunt ${$('demo-object').value}` });

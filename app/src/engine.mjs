import { catalog, challengeFor } from './catalog.mjs';

const DEFAULT_ANCHORS = {
  mug: { x: 0.31, y: 0.62 },
  notebook: { x: 0.61, y: 0.72 },
  plush: { x: 0.79, y: 0.48 },
};

export function initialState(saved = {}) {
  const objects = {};
  for (const [id, item] of Object.entries(catalog)) {
    const anchor = saved.objects?.[id] ?? DEFAULT_ANCHORS[id];
    objects[id] = {
      id,
      label: item.label,
      icon: item.icon,
      accent: item.accent,
      x: clamp(anchor.x, 0, 1),
      y: clamp(anchor.y, 0, 1),
      enabled: saved.objects?.[id]?.enabled ?? true,
    };
  }
  return {
    objects,
    queue: [],
    current: null,
    history: Array.isArray(saved.history) ? saved.history.slice(0, 30) : [],
    seenIds: [],
    counters: { received: 0, ignored: 0, completed: 0 },
    twitch: { status: 'disconnected', channel: null, error: null },
    agentMode: 'authored',
    updatedAt: Date.now(),
  };
}

function clamp(value, min, max) {
  return Number.isFinite(Number(value)) ? Math.max(min, Math.min(max, Number(value))) : min;
}

export function parseHaunt(text) {
  const match = String(text ?? '').trim().match(/^!haunt\s+([a-z]+)\s*$/i);
  return match ? match[1].toLowerCase() : null;
}

export function enqueue(state, { id, user, text, source = 'demo', timestamp = Date.now() }) {
  const objectId = parseHaunt(text);
  if (!objectId || !state.objects[objectId]?.enabled) {
    state.counters.ignored++;
    return { accepted: false, reason: 'unknown_command_or_object' };
  }
  if (source === 'twitch' && !id) {
    state.counters.ignored++;
    return { accepted: false, reason: 'missing_twitch_message_id' };
  }
  if (id && state.seenIds.includes(id)) {
    state.counters.ignored++;
    return { accepted: false, reason: 'duplicate' };
  }
  const cleanUser = String(user ?? 'viewer').replace(/[^a-zA-Z0-9_]/g, '').slice(0, 25) || 'viewer';
  const recent = [...state.queue, ...(state.current ? [state.current] : []), ...state.history].find(
    (item) => item.user.toLowerCase() === cleanUser.toLowerCase() && timestamp - item.receivedAt < 15000,
  );
  if (recent) {
    state.counters.ignored++;
    return { accepted: false, reason: 'viewer_cooldown' };
  }
  if (state.queue.length >= 8) {
    state.counters.ignored++;
    return { accepted: false, reason: 'queue_full' };
  }
  const entry = {
    id: id || `demo-${crypto.randomUUID()}`,
    user: cleanUser,
    objectId,
    source,
    receivedAt: timestamp,
    status: 'queued',
  };
  state.queue.push(entry);
  if (id) state.seenIds = [...state.seenIds.slice(-199), id];
  state.counters.received++;
  state.updatedAt = Date.now();
  return { accepted: true, entry };
}

export function takeNext(state) {
  if (state.current || !state.queue.length) return null;
  state.current = { ...state.queue.shift(), status: 'preparing' };
  state.updatedAt = Date.now();
  return state.current;
}

export function setCandidate(state, { challengeId, mode, maker, referee }) {
  if (!state.current || state.current.status !== 'preparing') throw new Error('No preparing round');
  const challenge = challengeFor(state.current.objectId, challengeId);
  if (!challenge) throw new Error('Challenge is outside approved catalog');
  state.current.challenge = challenge;
  state.current.agentMode = mode;
  state.current.maker = maker;
  state.current.referee = referee;
  state.current.status = referee.approved ? 'awaiting_approval' : 'vetoed';
  state.updatedAt = Date.now();
  return state.current;
}

export function useFallback(state) {
  if (!state.current || state.current.status !== 'vetoed') throw new Error('No vetoed round');
  const challenge = catalog[state.current.objectId].challenges[0];
  state.current.challenge = challenge;
  state.current.agentMode = 'authored-fallback';
  state.current.status = 'awaiting_approval';
  state.current.fallbackUsed = true;
  state.updatedAt = Date.now();
  return state.current;
}

export function approve(state) {
  if (!state.current || state.current.status !== 'awaiting_approval') throw new Error('Round is not awaiting approval');
  if (!challengeFor(state.current.objectId, state.current.challenge?.id)) throw new Error('Challenge is outside approved catalog');
  state.current.status = 'live';
  state.current.approvedAt = Date.now();
  state.current.endsAt = state.current.approvedAt + state.current.challenge.seconds * 1000;
  state.updatedAt = Date.now();
  return state.current;
}

export function finish(state, result) {
  if (!state.current) throw new Error('No active round');
  if (!['success', 'failure', 'skipped'].includes(result)) throw new Error('Invalid result');
  if (!['live', 'awaiting_approval', 'vetoed'].includes(state.current.status)) throw new Error('Round cannot be finished');
  if (result !== 'skipped' && state.current.status !== 'live') throw new Error('Round must be live');
  const ended = { ...state.current, status: result, finishedAt: Date.now() };
  state.history.unshift(ended);
  state.history = state.history.slice(0, 30);
  if (result === 'success') state.counters.completed++;
  state.current = null;
  state.updatedAt = Date.now();
  return ended;
}

export function setAnchor(state, id, x, y) {
  if (!state.objects[id]) throw new Error('Unknown object');
  state.objects[id].x = clamp(x, 0.05, 0.95);
  state.objects[id].y = clamp(y, 0.05, 0.95);
  state.updatedAt = Date.now();
  return state.objects[id];
}

export function setEnabled(state, id, enabled) {
  if (!state.objects[id]) throw new Error('Unknown object');
  state.objects[id].enabled = Boolean(enabled);
  state.updatedAt = Date.now();
  return state.objects[id];
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, parseHaunt, enqueue, takeNext, setCandidate, approve, finish, setAnchor, useFallback } from '../src/engine.mjs';

test('parses only a complete haunt command', () => {
  assert.equal(parseHaunt(' !HAUNT Mug '), 'mug');
  assert.equal(parseHaunt('!haunt mug extra'), null);
  assert.equal(parseHaunt('hello !haunt mug'), null);
});

test('rejects unknown, duplicate and rapid repeat commands', () => {
  const state = initialState();
  assert.equal(enqueue(state, { id: 'a', user: 'alice', text: '!haunt chair', source: 'twitch' }).accepted, false);
  assert.equal(enqueue(state, { id: 'b', user: 'alice', text: '!haunt mug', source: 'twitch', timestamp: 100000 }).accepted, true);
  assert.equal(enqueue(state, { id: 'b', user: 'alice', text: '!haunt mug', source: 'twitch', timestamp: 100001 }).reason, 'duplicate');
  assert.equal(enqueue(state, { id: 'c', user: 'alice', text: '!haunt plush', source: 'twitch', timestamp: 100002 }).reason, 'viewer_cooldown');
  assert.equal(state.queue.length, 1);
});

test('host approval gates overlay and records a round', () => {
  const state = initialState();
  enqueue(state, { id: 'real-1', user: 'alice', text: '!haunt mug', source: 'twitch' });
  takeNext(state);
  assert.equal(state.current.status, 'preparing');
  assert.throws(() => approve(state));
  setCandidate(state, { challengeId: 'mug-reveal', mode: 'two-agent', maker: { reason: 'Visual' }, referee: { approved: true, reason: 'Safe' } });
  assert.equal(state.current.status, 'awaiting_approval');
  approve(state);
  assert.equal(state.current.status, 'live');
  const ended = finish(state, 'success');
  assert.equal(ended.status, 'success');
  assert.equal(state.counters.completed, 1);
  assert.equal(state.history[0].source, 'twitch');
});

test('referee veto needs explicit authored fallback and host approval', () => {
  const state = initialState();
  enqueue(state, { id: 'real-2', user: 'bob', text: '!haunt notebook', source: 'twitch' });
  takeNext(state);
  assert.throws(() => setCandidate(state, { challengeId: 'made-up', mode: 'two-agent', maker: {}, referee: { approved: true } }));
  setCandidate(state, { challengeId: 'notebook-ghost', mode: 'two-agent', maker: {}, referee: { approved: false, reason: 'Too much' } });
  assert.equal(state.current.status, 'vetoed');
  assert.throws(() => approve(state));
  useFallback(state);
  assert.equal(state.current.status, 'awaiting_approval');
  assert.equal(state.current.agentMode, 'authored-fallback');
  assert.equal(state.current.challenge.id, 'notebook-airspell');
  assert.equal(state.current.veto.challenge.id, 'notebook-ghost');
  assert.equal(state.current.veto.referee.reason, 'Too much');
  assert.equal(state.current.referee.approved, true);
  approve(state);
  finish(state, 'skipped');
  assert.equal(state.history[0].status, 'skipped');
});

test('anchors stay within the camera frame', () => {
  const state = initialState();
  setAnchor(state, 'mug', -100, 10);
  assert.deepEqual([state.objects.mug.x, state.objects.mug.y], [0.05, 0.95]);
});

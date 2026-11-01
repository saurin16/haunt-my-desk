import test from 'node:test';
import assert from 'node:assert/strict';
import { WebSocketServer } from 'ws';
import { TwitchChat } from '../src/twitch.mjs';

test('EventSub welcome subscribes and chat notification reaches command handler', async () => {
  const server = new WebSocketServer({ port: 0 });
  await new Promise((resolve) => server.once('listening', resolve));
  const address = `ws://127.0.0.1:${server.address().port}`;
  let subscription;
  let sendNotification;
  let client;
  const fetchImpl = async (url, options) => {
    if (url.includes('/validate')) return { ok: true, json: async () => ({ client_id: 'client-123', scopes: ['user:read:chat'], user_id: '42', login: 'streamer' }) };
    subscription = JSON.parse(options.body);
    sendNotification();
    return { ok: true, json: async () => ({ data: [{ id: 'sub-1' }] }) };
  };
  const chatPromise = new Promise((resolve) => {
    server.on('connection', (socket) => {
      socket.send(JSON.stringify({ metadata: { message_type: 'session_welcome' }, payload: { session: { id: 'session-1' } } }));
      sendNotification = () => socket.send(JSON.stringify({
        metadata: { message_type: 'notification', message_timestamp: '2026-11-01T19:00:00.000Z' },
        payload: { subscription: { type: 'channel.chat.message' }, event: { message_id: 'msg-1', chatter_user_login: 'viewer', message: { text: '!haunt mug' } } },
      }));
    });
    client = new TwitchChat({ clientId: 'client-123', onChat: resolve, onStatus: () => {}, eventSubUrl: address, fetchImpl });
    client.authorize('a'.repeat(24)).catch(resolve);
  });
  let timeout;
  try {
    const chat = await Promise.race([chatPromise, new Promise((_, reject) => {
      timeout = setTimeout(() => reject(new Error('EventSub timeout')), 2000);
    })]);
    if (chat instanceof Error) throw chat;
    assert.equal(chat.id, 'msg-1');
    assert.equal(chat.user, 'viewer');
    assert.equal(chat.text, '!haunt mug');
    assert.equal(chat.timestamp, Date.parse('2026-11-01T19:00:00.000Z'));
    assert.deepEqual(subscription.condition, { broadcaster_user_id: '42', user_id: '42' });
    assert.deepEqual(subscription.transport, { method: 'websocket', session_id: 'session-1' });
  } finally {
    clearTimeout(timeout);
    client?.stop();
    await new Promise((resolve) => server.close(resolve));
  }
});

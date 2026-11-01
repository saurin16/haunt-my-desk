import WebSocket from 'ws';

const EVENTSUB_URL = 'wss://eventsub.wss.twitch.tv/ws';

export class TwitchChat {
  constructor({ clientId, onChat, onStatus }) {
    this.clientId = clientId;
    this.onChat = onChat;
    this.onStatus = onStatus;
    this.token = null;
    this.user = null;
    this.socket = null;
    this.retryTimer = null;
    this.retryCount = 0;
    this.stopped = true;
    this.lastMessageAt = 0;
  }

  status(status, error = null) {
    this.onStatus({ status, channel: this.user?.login ?? null, error });
  }

  async authorize(token) {
    if (!this.clientId) throw new Error('TWITCH_CLIENT_ID is missing');
    if (!/^[a-zA-Z0-9]{20,}$/.test(token)) throw new Error('Invalid token format');
    const response = await fetch('https://id.twitch.tv/oauth2/validate', {
      headers: { Authorization: `OAuth ${token}` },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error('Twitch rejected the access token');
    const info = await response.json();
    if (info.client_id !== this.clientId) throw new Error('Token belongs to a different Twitch app');
    if (!info.scopes?.includes('user:read:chat')) throw new Error('Token lacks user:read:chat scope');
    if (!this.stopped) this.stop();
    this.token = token;
    this.user = { id: info.user_id, login: info.login };
    this.stopped = false;
    this.retryCount = 0;
    this.open(EVENTSUB_URL, false);
    return this.user;
  }

  stop() {
    this.stopped = true;
    clearTimeout(this.retryTimer);
    this.socket?.close();
    this.socket = null;
    this.token = null;
    this.user = null;
    this.status('disconnected');
  }

  scheduleReconnect() {
    if (this.stopped || this.retryTimer) return;
    const delay = Math.min(30000, 1000 * 2 ** Math.min(this.retryCount++, 5));
    this.status('reconnecting', `Connection lost. Retrying in ${Math.round(delay / 1000)}s.`);
    this.retryTimer = setTimeout(() => {
      this.retryTimer = null;
      this.open(EVENTSUB_URL, false);
    }, delay);
  }

  open(url, isReconnect) {
    if (this.stopped) return;
    this.status(isReconnect ? 'reconnecting' : 'connecting');
    const socket = new WebSocket(url);
    const previous = this.socket;
    this.socket = socket;
    socket.on('message', async (raw) => {
      let packet;
      try { packet = JSON.parse(raw.toString()); } catch { return; }
      const type = packet.metadata?.message_type;
      if (type === 'session_welcome') {
        this.socket = socket;
        if (previous && previous !== socket) previous.close();
        this.retryCount = 0;
        if (!isReconnect) {
          try { await this.subscribe(packet.payload.session.id); }
          catch (error) { this.status('error', error.message); socket.close(); }
        } else {
          this.status('connected');
        }
      } else if (type === 'session_reconnect') {
        this.open(packet.payload.session.reconnect_url, true);
      } else if (type === 'notification' && packet.payload.subscription?.type === 'channel.chat.message') {
        const event = packet.payload.event;
        this.lastMessageAt = Date.now();
        this.onChat({ id: event.message_id, user: event.chatter_user_login || event.chatter_user_name, text: event.message?.text, source: 'twitch', timestamp: Date.now() });
      } else if (type === 'revocation') {
        const reason = `Subscription revoked: ${packet.payload.subscription?.status || 'unknown'}`;
        this.stop();
        this.status('error', reason);
      }
    });
    socket.on('error', () => {});
    socket.on('close', () => {
      if (this.stopped || socket !== this.socket && socket !== previous) return;
      if (socket === this.socket) this.socket = null;
      this.scheduleReconnect();
    });
  }

  async subscribe(sessionId) {
    const response = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Client-Id': this.clientId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'channel.chat.message',
        version: '1',
        condition: { broadcaster_user_id: this.user.id, user_id: this.user.id },
        transport: { method: 'websocket', session_id: sessionId },
      }),
      signal: AbortSignal.timeout(10000),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(`EventSub ${response.status}: ${result.message || 'subscription failed'}`);
    this.status('connected');
  }
}

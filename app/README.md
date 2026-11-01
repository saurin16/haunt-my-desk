# Haunt My Desk

A Twitch chat command points to a real object in a fixed camera shot. The host reviews a catalog challenge, approves it, and an OBS browser source overlays an animated spell and timer. The host performs the action and records the result. A separate public showcase uses a **simulated fixture**; it is not proof of Twitch connectivity.

## Run locally

Requires Node.js 22+ (developed on Node.js 24).

```bash
npm ci
cp .env.example .env
npm start
```

The server prints a private host URL containing an admin token in the fragment. Open that URL. The OBS source is `http://localhost:3000/overlay` at 1920 × 1080. Place it above a full-frame 16:9 camera source. The host preview uses the browser camera only when the host clicks **Start camera preview**; the browser may ask for camera permission.

To try the local interaction without Twitch, use **Simulate command** in the control room. It is labeled as simulation throughout the host page and ledger. The public `/showcase` page uses `demo.frozen.json` and is permanently labeled simulated.

## Connect real Twitch chat

1. Sign in to [Twitch Developer Console](https://dev.twitch.tv/console/apps). Twitch requires 2FA on the account before app registration.
2. Register a **Public** app, category **Chat Bot**, with the exact redirect URL `http://localhost:3000/auth/callback`. The public client ID is sufficient; no client secret is used.
3. Put the client ID in `.env` as `TWITCH_CLIENT_ID`, restart the server, then click **Connect Twitch** in the private host studio. Grant only `user:read:chat`.
4. In the signed-in channel's real Twitch chat, type `!haunt mug`, `!haunt notebook`, or `!haunt plush`. The command should arrive with a **REAL TWITCH CHAT** label. Click **Prepare next curse**, review, then **Approve & cast spell**.

The OAuth access token is kept in server memory and is lost on restart. It is never written to the JSON ledger. The event subscription uses Twitch EventSub WebSocket `channel.chat.message` with the broadcaster's own user ID. Chat messages that are not complete `!haunt` commands, unknown objects, duplicates, rapid repeats, and queue overflow are rejected.

## Two-agent mode

Set `OPENAI_API_KEY` in `.env` to enable two distinct Responses API calls: Challenge Maker chooses from a fixed catalog; Safety Referee independently approves or vetoes. The code also checks the returned ID against the catalog, and the host must still approve. An API failure switches to a visibly labeled authored fallback. `OPENAI_MODEL` defaults to `gpt-6-luna` and can be changed.

With no API key, the app runs **Authored Mode** and does **not** claim the two agents ran. Codex ChatGPT login does not automatically provide an API key.

## Host controls and data

The host can enable/disable three props and click their positions in the camera preview. Anchor positions and the last 30 round summaries are stored in `.local/state.json`. The `.local` folder and `.env` are gitignored. For an internet-facing deployment, set a strong `ADMIN_TOKEN` and use HTTPS in `PUBLIC_BASE_URL`; register that exact HTTPS callback on the Twitch app. Never share the private host URL. The read-only `/overlay`, `/showcase`, and `/api/state` endpoints are public by design.

## Verify

```bash
npm test
```

The tests cover command parsing, duplicate and cooldown filtering, host approval, referee veto, deterministic catalog rejection, safe fallback, round logging, and anchor bounds. A real Twitch/OBS test must be performed separately; local simulation is not a substitute.

## Sources

- [Twitch OAuth implicit grant](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth)
- [Twitch EventSub chat subscription](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchatmessage)
- [OBS browser source](https://obsproject.com/kb/browser-source)

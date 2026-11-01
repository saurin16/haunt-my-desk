# Devpost submission draft — not ready to submit

**Title:** Haunt My Desk

**Tagline:** Twitch chat curses real objects in a streamer's camera shot, and the streamer breaks the spell on camera.

## Description draft

Haunt My Desk gives a Twitch audience a visible way to change a streamer's real scene. The host marks a few safe desk props in a fixed camera frame. A viewer sends `!haunt mug` in Twitch chat. The app queues the request, selects a catalog challenge, waits for host approval, then shows an animated seal and countdown around the mug in an OBS browser source. The streamer performs the challenge and records the outcome. The viewer gets on-screen credit.

The code includes a Twitch EventSub WebSocket subscriber for `channel.chat.message`, a command queue, a host approval gate, a transparent overlay, and a round ledger. Two optional OpenAI Responses API specialists can choose and review a challenge; deterministic catalog validation and the host control what appears on stream. Without an API key, the app explicitly uses authored catalog mode. The public showcase uses a clearly labeled simulated fixture.

Codex was used to implement the state machine, EventSub integration, host studio, OBS overlay, and tests. **Replace this paragraph with the actual Codex session ID and a concise build/fix story.**

## Links to add after proof

- Source: https://github.com/saurin16/haunt-my-desk
- Public showcase: https://saurin16.github.io/haunt-my-desk/ (verify live)
- YouTube video: **TODO**
- Twitch channel: https://www.twitch.tv/saurin1602 (real command verified; filmed stream pending)
- Codex session ID: **TODO**

## Honesty gate before submission

- A real Twitch command and two API-backed agent reviews were verified locally on November 1; present this as a test, not as filmed stream footage.
- Do not describe the public static showcase as a live Twitch integration.
- Do not claim automatic object tracking or physical action detection.
- Replace this draft after filming with tested observations, exact metrics, and URLs.

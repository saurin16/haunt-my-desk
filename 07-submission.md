# Devpost submission draft — confirmed entrant answers

**Title:** Haunt My Desk

**Tagline:** Twitch chat curses real objects in a streamer's camera shot, and the streamer breaks the spell on camera.

## Description draft

Haunt My Desk gives a Twitch audience a visible way to change a streamer's real scene. The host marks a few safe desk props in a fixed camera frame. A viewer sends `!haunt mug` in Twitch chat. The app queues the request, selects a catalog challenge, waits for host approval, then shows an animated seal and countdown around the mug in an OBS browser source. The streamer performs the challenge and records the outcome. The viewer gets on-screen credit.

The code includes a Twitch EventSub WebSocket subscriber for `channel.chat.message`, a command queue, a host approval gate, a transparent overlay, and a round ledger. Two optional OpenAI Responses API specialists can choose and review a challenge; deterministic catalog validation and the host control what appears on stream. Without an API key, the app explicitly uses authored catalog mode. The public showcase uses a clearly labeled simulated fixture.

Codex was used to implement the state machine, EventSub integration, host studio, OBS overlay, and tests. During live testing, it helped diagnose and fix a CSS transparency bug that hid the camera beneath the overlay. In the completed November 1 local OBS take, a real Twitch chat command reached the queue, two API-backed agents reviewed a catalog challenge, and host approval displayed the spell over a real mug. The streamer visibly waved a free hand above the mug during the countdown, and the host marked the spell broken. The result card credited the Twitch sender.

## Links and remaining details

- Source: https://github.com/saurin16/haunt-my-desk
- Public showcase: https://saurin16.github.io/haunt-my-desk/ (verify live)
- YouTube video: https://youtu.be/7xoCHCcNqss (unlisted, verified in YouTube Studio)
- Twitch channel: https://www.twitch.tv/saurin1602 (real chat command verified; OBS recording was local)
- Codex session ID: `01a1906b-625a-75c2-b772-e7904e8af611`

## Required Devpost answers

**Submitter type:** Individual.

**Country of residence:** United States.

**How it meets the technology requirement:** I used OpenAI Codex to build and debug the Node.js Twitch EventSub chat listener, bounded command queue, two-agent review gate, host studio, transparent OBS overlay, and tests. The app connects to Twitch through OAuth and `channel.chat.message` events. A real `!haunt mug` message reached the host queue and drove the local OBS camera take. The public static showcase is labeled as a simulation.

**How streamers and their community use it:** The streamer marks a few safe props in the camera frame and adds the transparent overlay as an OBS browser source. Viewers cast `!haunt mug`, `!haunt notebook`, or `!haunt plush` in Twitch chat. The streamer approves a safe challenge, performs it in view of the camera, and marks the result. The viewer receives on-screen credit. The host can skip a challenge, and the catalog plus host approval gate what can appear on screen.

**Experience survey:** Skills developed: Significantly. Likelihood of using Codex again: Very likely.

**Eligibility:** The entrant confirmed reading and agreeing to the official rules, being at least 18 or the age of majority where they reside, residing in an eligible jurisdiction, and not being an employee, representative, or agent of the promotion entities.

## Honesty gate before submission

- A real Twitch command and two API-backed agent reviews were verified locally on November 1. The OBS recording captured a no-touch gesture and the host-recorded success outcome. It was not broadcast live on Twitch.
- Do not describe the public static showcase as a live Twitch integration.
- Do not claim automatic object tracking or physical action detection.
- The main Codex session ID and required entrant answers were confirmed on November 2, 2026.

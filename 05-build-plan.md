# Haunt My Desk — build plan

The submission deadline is November 2, 2026, 2:00 PM PT. Internal target is noon PT so the YouTube video can process and Devpost status can be checked.

| Phase | Work | Proof gate |
|---|---|---|
| 0 | Twitch sign-in/app registration, EventSub command and camera/OBS alignment spike | One genuine `!haunt mug` reaches a local log; OBS browser source visibly aligns with the camera. Mark as blocked until this happens. |
| 1 | Local app, host screen, overlay, public read-only replay | App starts with one command; public deployment URL opens in a clean browser. |
| 2 | Command queue and round state machine | Automated state tests for unknown object, duplicate message, cooldown, approve, success, skip. |
| 3 | Twitch OAuth + EventSub reconnect/revocation handling | Three live Twitch commands, one after reconnect, reach the queue. |
| 4 | Two specialist model calls + deterministic safety gate | Logs show maker/referee outputs; out-of-catalog or vetoed action never reaches overlay. Authored fallback is labeled. |
| 5 | Stream-facing visual polish and setup | OBS screenshot/video shows readable timer and object seal over camera; host can set anchors in under two minutes. |
| 6 | Frozen showcase, deployment, documentation | Clean-machine setup from README, live URL, no secrets committed, honest mode labels. |
| 7 | Record video and submit | Under-three-minute YouTube video with genuine Twitch and Codex footage; Devpost status reads Submitted. |

## Immediate go/no-go

Proceed with local code while waiting for Twitch login. A simulated-only demo does not satisfy the genuine Twitch footage requirement. If Twitch credentials or channel access are unavailable by the recording window, report the blocker explicitly rather than claiming the live integration was proven.

## Risks

- Twitch account/app setup requires the host's own sign-in and registered localhost redirect URI.
- A model API key is separate from Codex ChatGPT login. If unavailable, authored mode remains usable but runtime multi-agent is unverified.
- Physical actions are host approved and judged manually. There is no automatic safety guarantee.
- OBS browser source alignment assumes a fixed camera crop and 16:9 canvas.

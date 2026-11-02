# Devpost submission — Haunt My Desk

## One-line pitch

Twitch chat casts a spell on a real desk prop, and the streamer breaks it on camera.

## Inspiration

Chat already shapes what streamers say and play. I wanted one chat message to create a small physical moment in the camera shot: a real object, a visible challenge, and a result the viewer can see.

## What it does

A viewer types `!haunt mug` in Twitch chat. A Twitch EventSub listener receives the command and places it in a bounded host queue. The host has marked the mug's position in the camera frame. Challenge Maker proposes an action from a fixed safe catalog, and Safety Referee can veto it. Catalog validation and host approval decide what can appear in the OBS browser source. Once approved, the overlay shows a spell card and timer over the mug. The streamer performs the challenge, records the outcome, and the result credits the viewer's Twitch name.

## How we built it

We built a Node.js app with a Twitch OAuth and EventSub WebSocket client, command parser, duplicate and cooldown controls, a round state machine, a private host studio, and a transparent 1920 × 1080 OBS browser source. The two optional AI roles use separate OpenAI Responses API calls. Without an API key, the interface explicitly labels authored catalog mode. A static public showcase is separately labeled as a simulation.

Codex helped implement the Twitch listener, queue, agent review gate, host controls, overlay, and tests. During real camera testing, Codex helped trace and fix a CSS transparency bug that hid the camera beneath the overlay. The repository includes the source, setup instructions, and seven automated tests.

## Challenges we ran into

The real camera setup took several tries. An OBS camera preview initially appeared black, and an overlay transparency bug obscured the camera. We fixed the source layout and CSS, then ran a real Twitch command through the host queue and recorded a local OBS take. The final video says explicitly that this was a local recording triggered by a real Twitch message, not a live Twitch broadcast.

## Accomplishments we're proud of

- A genuine `!haunt mug` message from `saurin1602` reached the EventSub queue.
- Two API-backed reviews selected and checked a catalog challenge before host approval.
- The OBS recording shows the spell overlay on a real red mug, a no-touch hand gesture, and a success result crediting the sender.
- The 72-second local demo uses the streamer's recorded voice and timed captions.

## What we learned

For a physical stream interaction, the host needs a clear final say. The AI roles can add variety, while the fixed catalog, object anchors, and host gate keep the on-camera action predictable.

## What's next

Test the loop during a live Twitch broadcast with viewers, improve the host's one-time camera setup, and let streamers choose their own safe catalog entries.

## Links

- Source: https://github.com/saurin16/haunt-my-desk
- Public showcase (labeled simulation): https://saurin16.github.io/haunt-my-desk/
- Twitch channel: https://www.twitch.tv/saurin1602
- YouTube demo: **add after upload**
- Main Codex session ID: **confirm before submission**

## Submission checks

- The local video and captions are ready. It contains actual screenshots of the verified Twitch chat command and host result ledger, plus genuine local OBS footage. The video does not contain a screen recording of the Twitch chat page or Codex interface.
- The local recording was not a live Twitch broadcast. Do not imply otherwise.
- Object positions are manually anchored; the app does not track props or detect the physical gesture automatically.
- Confirm the final YouTube URL and main Codex session ID before submitting.

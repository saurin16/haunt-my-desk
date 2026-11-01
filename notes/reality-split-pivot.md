# Pivot candidate — Reality Split

**Date:** November 1, 2026. User rejected CanonCue as insufficiently bold. Reality Split is also **not selected**: the proposed interaction is too close to existing chat-vote and story-overlay submissions to justify a winning recommendation. This is historical ideation, not a build brief.

## One-line pitch

**Twitch chat and two competing AI directors turn a live stream into a 60-second alternate-reality episode.** The audience decides which reality takes over the broadcast; the streamer performs the winning twist.

## The show loop

1. Streamer presses **Split Reality**. The OBS browser source splits the broadcast into two stylized futures, for example horror vs breaking-news comedy.
2. Viewers pitch a short twist via `!twist ...` in real Twitch chat. Director A and Director B independently turn approved chat input into contrasting, bounded scene cards and a one-line prompt for the streamer.
3. Chat votes for one future. The streamer sees both proposals and approves the winner. The chosen reality takes over the OBS overlay for 60 seconds with a visual transition, lower thirds, timer, and original sound cue. The streamer improvises in that world.
4. The episode ends with a compact recap card crediting contributors. A reset restores the original scene. No unapproved chat text or model output goes on air.

**Example:** A viewer pitches “the moon wants a refund.” One director stages a cosmic emergency; the other stages a ridiculous customer-service newscast. Chat chooses; the streamer has one minute to explain the crisis live.

## Why it fits this hackathon

- The official brief asks for creative, interactive experiences built with Codex that connect to Twitch; the judging rubric gives Design (“fun to watch”) equal weight with Innovation, Impact, and Tech. [Event page](https://twitchcon-codex.devpost.com/), [rules](https://twitchcon-codex.devpost.com/rules).
- **Real Twitch connection:** `channel.chat.message` EventSub for pitches and votes, requiring an authorized `user:read:chat` token. [Twitch docs](https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types).
- **Actual broadcast transformation:** OBS browser-source overlays; optionally OBS WebSocket scene/visual changes. OBS WebSocket is built in to OBS Studio 28 and later. [OBS compatibility](https://obsproject.com/kb/obs-studio-28-plugin-compatibility), [OBS WebSocket protocol](https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.json).
- **Codex story:** build the Twitch intake, two directors, safe approval gate, scene engine, and visual effects in one Codex task, then show real build/debug footage in the submission video.

## Competitive position and decision

Existing 2026 entries already include [Chat Relay Studio](https://devpost.com/software/chat-relay-studio) (chat votes on a story overlay), [Understudy](https://devpost.com/software/understudy-e67i2x) (AI stand-in host), [ARAGOZ](https://devpost.com/software/aragoz) (chat-authored monster), and [Chat Choir](https://devpost.com/software/chat-choir) (chat-written soundtrack). Reality Split's distinct promise would be a live human streamer performing inside an audience-selected broadcast genre, but the present design remains a twist submission, vote, and overlay. **Decision: do not build this version.** It lacks sufficient differentiation and a verified streamer need.

## Scope and risks

- One streamer, two authored visual genres, one 60-second round, one chat command for twist, one vote, one approval. Do not promise free-form video generation or arbitrary OBS control.
- Greatest risk is live Twitch chat plus OBS integration. Phase 0 should prove both before producing art.
- Runtime model provider is unconfirmed. If unavailable, an authored deterministic director path can power a real Twitch test, but the build must be described honestly and would miss the local multi-agent goal.
- Estimated stage impact is higher than CanonCue; technical and design risk are also higher. No tested outcome or judge-score claim yet.

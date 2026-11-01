# Step 3 — Three concepts and selection

> Historical first pass. The current recommendation is in [03-concepts-revised.md](03-concepts-revised.md).

Researched November 1, 2026. Scores below are **subjective estimates**, not judge predictions. This event has one ranking and four equally weighted criteria: Innovation, Potential Impact, Technological Implementation/Codex Use, and Design. [Official rules](https://twitchcon-codex.devpost.com/rules). No source establishes revenue, retention, or adoption numbers for these concepts; proposed metrics are prototype measurements.

## A. CanonCue — chat writes rumors; the GM decides what enters the world

**Problem.** Tabletop GMs want chat participation without interrupting play. This appears in [a direct D&D streamer question](https://www.reddit.com/r/DungeonsAndDragons/comments/16vg1hk/engaging_chat_during_dnd/), [a Roll20 GM discussion](https://app.roll20.net/forum/post/6057288/starting-a-d-and-d-stream-or-already-on-board-discussion/?pageforid=6057505), and [warnings about disruptive votes](https://www.reddit.com/r/dndnext/comments/dtulhc/an_interactive_dnd_stream/).

**Live loop.** At a scene pause, the GM opens a Rumor Window. Viewers submit `!rumor ...` in real Twitch chat. Two independent agents check campaign-lore consistency and table tone/pacing. A deterministic gate holds all ideas for GM review. Only an approved rumor appears in an OBS browser source with viewer credit; it joins a session chronicle. A rumor is in-world hearsay, never an automatic change to canon.

**Why more than a wrapper.** Twitch messages become typed events, agents return separate structured judgments and edits, the GM resolves disagreements, and approval changes the live broadcast and an auditable artifact. No model output can publish itself.

**Differentiation.** [Chat Relay Studio](https://devpost.com/software/chat-relay-studio) already offers story choices with moderator approval; [Race Control](https://devpost.com/software/race-control) offers an AI game master. CanonCue is a tabletop-specific, GM-controlled rumor workflow at natural pauses, with lore/tone disagreement visible in the dashboard and no chat vote forcing a plot. This distinction must be obvious in the demo.

**Risk.** Medium: real Twitch auth/EventSub and two reliable agent calls. A solo GM can record the loop without a full party. No separate prize track. **Prototype measures:** real proposals, approval rate, approval-to-overlay delay, and unapproved proposals shown (target zero).

## B. Studio Window — artist-controlled prompts during creative breaks

**Problem.** Art streamers report unsolicited critique and requests in [2024](https://www.reddit.com/r/Twitch/comments/1ezwuek/advice/), [2025](https://www.reddit.com/r/Twitch/comments/1p0sq1o/why_do_only_artists_watch_my_streams_and_it/), and [2026](https://www.reddit.com/r/Twitch/comments/1tgik9a/etiquette_for_artists_advertising_in_chat/).

**Live loop.** Artist opens a short inspiration window. Chat submits color, motif, or story prompts. Separate clustering and boundary agents group duplicates and flag violations. The artist approves one; an overlay credits the contributor and a session record preserves it.

**Why more than a wrapper.** Time-boxed chat intake, distinct specialist actions, human publication, and on-stream payoff. **Differentiation/risk:** strong current consent story, but a convincing demo needs an actual artist making work on stream. Medium build risk and high demo credibility risk. No separate prize track. **Prototype measures:** zero accepted suggestions outside the window; approval time and approved count.

## C. Raid Bridge — shared welcome ritual for incoming communities

**Problem.** A [2026 raid account](https://www.reddit.com/r/Twitch/comments/1udd9at/how_to_lose_your_first_raid_in_30_seconds/) and [viewer discussion](https://www.reddit.com/r/Twitch/comments/1hydosv/whats_something_a_streamer_has_done_thats_made_you/) show that awkward reception can squander a raid.

**Live loop.** A real raid EventSub event starts a 45-second welcome panel. Incoming viewers propose a call-and-response. One agent condenses choices; another checks recipient rules. The host approves one, and an overlay cues both communities.

**Why more than a wrapper.** A live raid event triggers timed intake, independent checks, host approval, and a shared action. **Differentiation/risk:** emotional payoff, but authentic recording needs two coordinated Twitch channels and a real raid. High integration/demo risk. No separate prize track. **Prototype measures:** raid-to-cue time and participating chatters; no retention claim.

## Rubric estimate

| Concept | Innovation | Impact | Tech/Codex | Design | Equal-weight total | Delivery risk |
|---|---:|---:|---:|---:|---:|---|
| **A. CanonCue** | **8.0** | **8.0** | **8.0** | **8.0** | **8.00/10** | Medium |
| B. Studio Window | 7.5 | 8.0 | 7.5 | 7.5 | 7.63/10 | Medium, demo risk high |
| C. Raid Bridge | 7.5 | 7.5 | 7.0 | 8.0 | 7.50/10 | High |

**Pick A: CanonCue.** It has the clearest validated interruption problem, a real Twitch-to-overlay loop one person can record, and a memorable contract: chat offers in-world rumors; the GM alone puts them on air. This is a strategic bet, not a calculated probability of winning. Phase 0 tests Twitch auth; the video must distinguish it from existing story-vote tools in its first 10 seconds.

**Runner-up:** Studio Window if a credible artist demo becomes available and tabletop footage proves impractical.

# Revised concept selection — November 1, 2026

**Reason for revision:** CanonCue lacked a memorable on-stream payoff. Reality Split reduced to a story vote plus overlay, overlapping with [Chat Relay Studio](https://devpost.com/software/chat-relay-studio). The official criteria equally weight innovation, usefulness/entertainment, technical implementation/Codex use, and design; innovation breaks ties. [Rules](https://twitchcon-codex.devpost.com/rules). Scores below are subjective planning estimates, not probabilities of winning.

## Selection constraints

- A stranger can understand the live result in ten seconds.
- Twitch viewers do something that changes the actual stream, not just a tally or text queue.
- One person can build and film a real Twitch interaction before November 2, 2:00 PM PT; internal target noon PT.
- A public read-only replay is possible, while the submission video shows genuine Twitch footage and Codex work.
- No outcome, model capability, audience benefit, or current competitor quality is assumed without a test.

## A. Haunt My Desk — viewers turn real objects in the streamer's camera into timed challenges

**Hook:** “Chat just cursed the mug on my desk. I have 30 seconds to break the spell.”

The streamer points a fixed camera at a desk and marks two or three safe objects in a setup preview. A viewer types `!haunt mug` in Twitch chat. An animated seal locks onto that mug in the OBS camera overlay, a short challenge appears, and a timer starts. For example: “Balance three coins on the mug before the clock runs out.” The streamer does it in the real camera shot and marks success or failure. The viewer receives on-screen credit; a round card records the result. The host can skip any challenge.

Two separate specialist agents are planned: a **Challenge Maker** proposes a short action using only the host-approved objects, and a **Safety Referee** checks physical safety, feasibility, and stream boundaries. A deterministic allowlist and host approval gate publication. The MVP uses **host-placed static object anchors**, not unverified live object tracking. If model access fails, a clearly labeled authored-challenge mode can support a real Twitch test; it must not be described as multi-agent runtime behavior.

**Why it may stand out:** the chat action visibly changes the streamer's *real camera scene* and prompts a physical response. The specific camera-anchored interaction did not appear in the indexed entries checked, although the public gallery is incomplete. Adjacent entries include [ARAGOZ](https://devpost.com/software/aragoz) (chat-authored virtual monster), [Minefield](https://devpost.com/software/minefield) (chat plants spoken-word traps), and [HEIST](https://devpost.com/software/heist-2nxbmq) (collaborative escape room). None establishes that this idea is unique across all submissions.

**Problem evidence:** [small streamers discuss the need for low-friction viewer interaction](https://www.reddit.com/r/Twitch/comments/1kfb8h7/small_streamers_what_do_you_find_hardest_to_manage_when_no_ones_really_watching/), and [a creator describes using desk objects to spark interaction](https://www.reddit.com/r/Twitch/comments/13mbtz8/how_do_i_interact_with_viewers_more_i_feel_more/). These are adjacent signals, **not validation** that streamers want this exact tool. The hackathon allows entertainment as impact; that must be shown in the demo rather than claimed from these sources.

**Build shape:** Twitch EventSub chat → short command parser → two agent checks → host approval → transparent OBS browser source anchored over camera → round result. No Extension review, game integration, AI video generation, or automatic physical-action detection. **Phase 0:** prove real Twitch `!haunt` event plus camera/OBS overlay alignment and model credential. **Risk:** medium-high; authentic demo requires Twitch account, a usable camera, OBS, and physical performance. Camera availability remains unconfirmed.

**Measurable test:** at least three real Twitch commands, one approved challenge, approval-to-overlay latency, zero unapproved text on stream, one filmed physical completion. No retention or revenue claim.

## B. Instant Encore — chat turns a live moment into a replay segment

Viewers mark a moment with `!encore`; a host-approved tool saves the OBS replay buffer, overlays credited chat reactions, and plays a short replay on stream. This addresses the documented pain of [finding moments in long VODs](https://www.reddit.com/r/Twitch/comments/1f9otx4/what_do_yall_make_clips_of_or_how_do_yall_make/). **Distinctive result:** the community sees its own moment replayed during the broadcast. **Risk:** high. OBS replay-buffer control, encoding, audio rights, and timing create a larger integration surface. Existing live clip products such as [Clipsie](https://clipsie.app/) also narrow the novelty claim. Could be useful, but a broken replay would lose the demo.

## C. Raid Portal — an arriving audience opens a shared scene

A real raid triggers a short portal scene where both communities perform one joint action before the receiving stream resumes. The social pain is supported by [a 2026 raid account](https://www.reddit.com/r/Twitch/comments/1udd9at/how_to_lose_your_first_raid_in_30_seconds/). **Risk:** high. A genuine test requires two coordinated channels and a real raid. [RaidBridge](https://devpost.com/software/canoncue) already offers an approved raid welcome ritual, while [Twinclue](https://devpost.com/software/twinclue) uses multiple channels for shared clues. The overlap weakens the win case.

## Decision matrix

| Concept | Innovation | Impact | Tech/Codex | Design | Estimated average | Critical risk |
|---|---:|---:|---:|---:|---:|---|
| **A. Haunt My Desk** | **8.5** | **7.5** | **7.5** | **8.5** | **8.00/10** | Camera/OBS + real chat proof |
| B. Instant Encore | 7.0 | 8.0 | 6.5 | 8.0 | 7.38/10 | Replay capture/encoding |
| C. Raid Portal | 6.5 | 7.5 | 7.0 | 8.0 | 7.25/10 | Two-channel live raid, overlap |

**Recommendation: Haunt My Desk, conditional on a Phase 0 spike.** It offers the clearest visual difference from the visible current field while staying small: one fixed camera, two marked objects, one safe challenge loop. The score is a relative planning judgment, not a winning prediction. If the real Twitch/camera test cannot be completed quickly, do not proceed with a simulated-only submission narrative.

**Next step:** write the exact one-round brief and run the Phase 0 proof before visual polish. [Twitch EventSub chat authorization](https://dev.twitch.tv/docs/chat/authenticating); [OBS browser source setup](https://obsproject.com/kb/browser-source).

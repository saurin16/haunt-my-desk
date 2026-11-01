# Step 1 — TwitchCon trend scan

Researched November 1, 2026. **Evidence boundary:** the 2024 projects below are confirmed Twitch hackathon winners. The 2026 projects are current submissions, not winners. The 2026 public gallery is not published yet, so indexed individual entries show examples, not a complete field. Our recommendations are inferences from these sources and this event's [equal-weight rubric](https://twitchcon-codex.devpost.com/rules).

## Three winning patterns to learn from

### 1. Give viewers visible agency over the live show

[PixelWars](https://devpost.com/software/bitwars), the 2024 interactive-community winner, let two streamers' audiences send named characters into a live battle. [Spectators Control Minecraft Mobs](https://devpost.com/software/stream-mob-control-mod) was a runner-up that let viewers alter gameplay. The common loop is **viewer action → immediate on-stream consequence → shared payoff**. That serves this event's Impact and Design criteria, and a novel version can score on Innovation. [2024 winners announcement](https://twitchstreamertools.devpost.com/updates/33853-streamer-tools-hackathon-2024-winners-and-runner-ups)

### 2. Add context that makes a specific stream better to watch

[tcghud](https://devpost.com/software/tcghud-by-tangia), the 2024 stream-appearance winner, identified trading cards shown on camera and displayed useful data in an OBS browser source. The focused audience and sub-second feedback made the overlay part of the content, not decoration. Twitch's own [showcase](https://dev.twitch.tv/showcase) includes contextual overlays and audience-control integrations. **Inference:** a narrow stream format with a clearly missing visual aid offers more novelty than a general stream dashboard. [2024 winners announcement](https://twitchstreamertools.devpost.com/updates/33853-streamer-tools-hackathon-2024-winners-and-runner-ups)

### 3. Preserve a community-created result beyond the moment

[Stream Together Timeline](https://devpost.com/software/stream-together-timeline), the 2024 collaboration winner, saved shared sessions and clips in an accessible timeline. PixelWars also made individual viewer contributions identifiable. **Inference:** a live experience is stronger when it yields a clip, scorecard, artifact, or story a streamer can share after the broadcast. This can show impact without claiming unmeasured retention or revenue. [2024 winners announcement](https://twitchstreamertools.devpost.com/updates/33853-streamer-tools-hackathon-2024-winners-and-runner-ups)

## What the current field already contains

Individual 2026 entries include [StreamCanvas](https://devpost.com/software/streamcanvas) (chat-painted pixel mural), [Chat Bets](https://devpost.com/software/chat-bets) (prediction overlay), [ChatForge](https://devpost.com/software/chatforge) (chat proposes and votes on game features), [Backlog](https://devpost.com/software/backlog-6ox4lv) and [Missed Questions](https://devpost.com/software/missed-questions) (question handling), and [Race Control](https://devpost.com/software/race-control) (AI referee/game master). These pages establish that these directions already have entrants; they do not establish quality or likely placement. The [gallery](https://twitchcon-codex.devpost.com/project-gallery) was unpublished when checked.

**Avoid as a primary pitch:** a generic poll/prediction, chat-controlled minigame, pixel mural, question summarizer, or all-purpose AI stream assistant. The event page itself says its polls, Twitch Plays, and dice roller examples are starting points, not templates, and asks for original ideas. [Event page](https://twitchcon-codex.devpost.com/)

## Architecture pattern that fits the deadline

**Twitch chat or EventSub → small event/state engine → live WebSocket update → OBS browser-source overlay + broadcaster control page.** Put a simulated event feed through the same state engine for repeatable tests; show *real Twitch footage* in the submission video. This pattern appears in [PixelWars](https://devpost.com/software/bitwars) and current entries such as [StreamCanvas](https://devpost.com/software/streamcanvas). Twitch documents [EventSub WebSocket connection and reconnection](https://dev.twitch.tv/docs/eventsub/handling-websocket-events/), which should be tested before visual polish.

For a solo, roughly one-day build, a single TypeScript/Node service and plain browser overlay would reduce deployment and integration work. A separate model service, LangGraph, database, or native Twitch Extension earns its place only if the chosen user experience actually requires it. Twitch's [Extension review guidance](https://dev.twitch.tv/docs/extensions/submission-best-practices/) shows configuration and review work that a browser source avoids. This is a feasibility recommendation, not a judging preference.

## One direction to investigate next

**Find a specific stream format where chat can collaboratively create a useful, visible artifact during the show.** Keep the first version to one streamer and one repeatable live loop; add cross-stream features only if the pain evidence warrants them. This combines the three observed patterns while steering clear of the most visible 2026 entry clusters. Step 2 should test actual streamer/viewer complaints in that niche before we commit to a concept.

## What we still need to learn

- Which stream format has repeated complaints from real streamers or viewers, with at least three independent sources or one substantial discussion?
- Can its core loop be demonstrated on a real Twitch channel and in OBS before the internal submission target (Nov 2, 12:00 PM PT)?
- What is the exact measurable output of one live session (participants, contributions, completion time, or artifact produced), and can we measure it honestly in the demo?

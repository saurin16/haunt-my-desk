# Rules & Rubric — Codex x TwitchCon Hackathon
- Fairness: every entrant should use the same published eligibility, deadline, judging, and submission information on Devpost; no private criteria are assumed here.
- URL: https://twitchcon-codex.devpost.com/ (rules: /rules)
- Legal sponsor: Amazon Advertising LLC · Admin: Devpost · OpenAI and Twitch are featured partners
- **Deadline: Mon Nov 2, 2026, 2:00 PM PT** (target submit by 12:00 PM PT, 2h buffer)
  - **4:00 PM CT** on Nov 2; target **2:00 PM CT**. Opened Oct 23, 10:00 AM PT.
- Official rules give judging as Nov 5–15; top 5 are shown and winners announced on the Codex Booth stage at TwitchCon San Diego around **Nov 15**. ⚠️ Devpost's key-dates feed currently gives a different judging interval (Nov 3–6); use the official rules for this point and ask Devpost if the judging window affects a decision.
- Eligibility: individuals at least 18 or the age of majority where they reside, whichever is older; solo or teams of eligible individuals. Organizations are excluded. The official rules list Brazil, Quebec, Russia, Crimea, Cuba, Iran, North Korea and other prohibited jurisdictions, plus promotion-entity staff, judges, and related conflicts of interest. Read the full rules for the exact exclusions.
- New work only: must be built during Oct 23 – Nov 2. Templates, libraries and AI assistants are allowed.

## Submission requirements
1. **Repo** (GitHub/GitLab/Bitbucket) with all source, assets and run instructions. If private, share it with testing@devpost.com.
2. **Demo video, under 3 min, publicly viewable on YouTube.** It must show (a) the project **working on Twitch** and (b) **how it was built with Codex**. The Oct 30 organizer update says *unlisted is fine; private is not*, and asks for real footage rather than slides or screenshots. Upload early: YouTube processing can take hours. No copyrighted music or third-party marks without permission.
3. **Text description:** features, functionality, how Codex was used.
4. **Codex session ID** for the thread where most of the build happened (`/status` in Codex).
   → ⚠️ **Build most of the app inside ONE Codex task.** Keep that task's session ID for submission.
- Must "connect to Twitch": chat, overlay, Twitch API, EventSub or an Extension. Must be interactive.
- A public app URL is **not** an official form requirement, but the repo and demo must give judges usable access. Our local playbook calls for a deployed URL to reduce judging friction and show the design.
- Devpost's submission form additionally requires submitter type and residence, explanations of how the project meets the Codex/Twitch requirement and how streamers/community use it, two experience survey answers, and eligibility checkboxes. Answer these truthfully when submitting.
- **Draft is not submitted.** Verify the Devpost status reads **Submitted** before the deadline; then keep the judged repo, video, and links stable through winner announcements, per the Oct 30 organizer update.

## Tracks / prizes
Single overall ranking. No tracks or sponsor sub-prizes, so **no category stacking.**
| Place | Prize |
|---|---|
| 1st | $10,000 + TwitchCon stage |
| 2nd | $6,000 + stage |
| 3rd | $4,000 + stage |
| Runner-up ×2 | $2,500 each + stage |

## Required tech
- **OpenAI Codex** (required, and scored in the Tech criterion)
- **Twitch:** API / EventSub / chat (IRC/EventSub chat) / Extensions / overlays
- Suggested starting point: dev.twitch.tv "Example Chatbot" guide; TwitchDev Discord #codex-twitchcon-hackathon

## Judging (real rubric, replaces the default)
Stage 1: pass/fail. Does it fit the theme and actually use Codex + Twitch?
Stage 2: **4 criteria, equally weighted (25% each)**, in this order (the order also breaks ties):
| # | Criterion | Exact wording | What wins it |
|---|---|---|---|
| 1 | Innovation/Idea | "How creative and novel is the concept and does the project differ from existing concepts?" | Not a poll, Twitch Plays or dice-roller rebuild (examples are explicitly discouraged) |
| 2 | Potential Impact | "How useful or entertaining is it for streamers and their communities?" | A streamer would actually leave it on; chat engagement |
| 3 | Technological implementation | "How well is it built, and how well does it use Codex?" | Clean EventSub/chat integration + a visible Codex build story |
| 4 | Design | "Is it easy to use and fun to watch?" | One-click setup, overlay that looks great on stream |

- **Tie-break order = Innovation > Impact > Tech > Design** → novelty matters most.
- Judges: "A panel of qualified judges", not named. Rules allow "automated AI-driven analysis", so the text description needs to be explicit and keyword-clear.
- The official rules say judges may assess the description, images, and video without testing the project. The first 10 seconds of the video and the written description therefore need to communicate the experience clearly.

## Strategic implications (vs. my default playbook)
- **Audience is consumer/entertainment, not enterprise.** "Business Viability" is replaced by "useful or entertaining." There is no buyer or ROI angle. The measurable outcome becomes chat engagement (msgs/min, unique chatters, retention).
- **"Fun to watch" is 25%.** The visual overlay is a scoring surface, not polish.
- **Multi-agent is not required** by the rubric. I'll keep it only where it creates on-stream spectacle (agents visibly arguing/reacting); otherwise cut it.
- **Demo = real Twitch stream footage** (my own channel, test chat) + Codex build footage. Plan screen recording of Codex sessions from the start.
- ⚠️ GAP: no word on whether Twitch Extension review/approval is needed. Avoid hosted Extensions (review delay) and use **chat bot + browser-source overlay** (no approval needed).
- ⚠️ GAP: Twitch dev app + bot account + EventSub auth is the riskiest integration → Phase 0.

## Win conditions for this event
1. **Clear, original on-stream loop:** one interaction a streamer and chat can understand immediately, with a result that is visible and entertaining live. The organizer explicitly advises that small and impactful beats big and generic.
2. **Real Twitch connection:** show chat, EventSub, API, or another working integration in a real Twitch session. Avoid a simulated-only demo.
3. **Reliable end-to-end behavior:** README setup, no committed secrets, tested normal and recovery paths. A judge should be able to run it, but the video must stand on its own.
4. **Stream-facing design:** readable overlay and controls at stream scale; quick setup for the broadcaster; audience feedback within seconds.
5. **Visible Codex contribution:** keep the main build in one Codex task, save its session ID, and show how Codex helped implement and fix the product in the video and description.
6. **Submission execution:** reserve time for recording and YouTube processing; submit by the internal 2-hour buffer and verify **Submitted**.

## Sources and questions
- [Official rules](https://twitchcon-codex.devpost.com/rules) · [Event overview and requirements](https://twitchcon-codex.devpost.com/) · [Organizer updates](https://twitchcon-codex.devpost.com/updates)
- Official rules questions: [Devpost support](mailto:support@devpost.com) or the [TwitchDev Discord](https://discord.gg/G8UQqNy) `#codex-twitchcon-hackathon` channel.
- **A note on accuracy:** this guide is a helper. The information on the Devpost website is the correct and accurate version — if there is ever any discrepancy between what you read here and what the website says, the website prevails.

# Build Plan — <Name>
Total budget: <hours>. Rule: no phase starts until the previous gate shows real terminal output.

## Phase 0 — Riskiest-unknown spike (≤2h) 🚦 GO/NO-GO
- Integration: <API auth / SDK / cloud access>
- Test: <command> → expected output
- **No-go fallback:** <alternative>

## Phase 1 — Skeleton + public deploy (≤2h)
- Repo, Next.js + FastAPI hello-world, deployed to <Vercel/Cloud Run>
- Gate: `curl <public-url>/health` → 200

## Phase 2 — Core agent graph
- Gate: unit tests for each node pass (paste output)

## Phase 3 — Tools / real actions + risk gate (graduated autonomy)
- Gate: low-risk action auto-executes; high-risk action pauses for approval

## Phase 4 — UI: live agent timeline (SSE) + audit trail
- Gate: end-to-end run visible in browser on public URL

## Phase 5 — Failure + recovery path + metrics panel
- Gate: injected failure is detected and recovered on screen

## Phase 6 — Frozen demo mode
- `demo.frozen.json` committed; default = frozen, `?live=1` = live
- Gate: demo runs with network off for model APIs

## Phase 7 — Polish, README, video, submit
- Gate: incognito check of public URL; rubric audit ≥8/10 every line

## Cut list (drop in this order if behind)
1. 2. 3.

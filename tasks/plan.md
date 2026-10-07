# Implementation Plan: Smart Kids Games

## Overview

Scaffold a SvelteKit app on Vercel’s Node.js runtime, persist anonymous picture slots and play records in Atlas, then ship Meadow Home and the catalog one vertical slice at a time. First playable path: pick a nest, hear a flag, enter Paint. Remaining games reuse `play-runtime`. Spec: `.scratch/smart-kids-games/spec.md`.

## Architecture Decisions

- **Placeholders first.** Friends, outlines, voice, and SFX start as SVG, short recorded placeholders, or Kenney files checked into `static/`. FLUX and Qwen generation is a later replacement of those files, not a runtime dependency.
- **Server writes only.** Browser talks to SvelteKit form actions / `+server.ts`. `MongoClient` lives in `src/lib/server/mongo.server.ts`. Slot id is an httpOnly cookie (or four cookies / one JSON cookie) holding anonymous ids, not a login.
- **Game as data + one shell.** `play-runtime` owns enter, language copy, next level, replay stars, success/miss, faster-voice. Each game supplies a board component and a level table.
- **No Edge.** Adapter Node.js only so the driver can load.

```
platform (SvelteKit + MongoClient)
    → picture-slot (cookie ids + Atlas documents + notice)
        → home (Meadow cottages)
        → play-runtime (level cursor + SFX + voice)
            → games (Paint first, then pattern copies)
assets run in parallel as file drops into static/
```

## Task List

Indexed in [todo.md](todo.md). Phases: Foundation → Home & play → First four games → Remaining catalog → Asset swap.

## Parallelization

- After Task 1, Task 2 (Mongo types) and placeholder art in `static/` can proceed together.
- After play-runtime exists, later games are sequential only if they share files; otherwise one game per session.
- Do not parallelize cookie/slot schema with Home; Home reads slots.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Atlas URI leaked again | High | `.env` gitignored; CI uses a mock; never log the URI |
| Cookie + Atlas id mismatch | Med | Create slot document in the same action that sets the cookie |
| Too many games in one session | Med | One game (or one quiz family) per task; stop at checkpoints |
| COPPA/GDPR vs anonymous id | Med | Spec already chose slots + notice; do not add email “to be safe” without asking |
| Real FLUX/Qwen not ready | Low | Ship placeholders; Task 22 swaps files only |

## Open Questions

None that block the plan. Generate-on-device art/voice happens when you run the studios; the app does not wait on that for Task 1–21.

## Checkpoints

Human review after Foundation, after Home & play, after the first four games, and at the end. No implementation until this plan is approved.

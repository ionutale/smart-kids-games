# Tasks: Smart Kids Games

Spec: `.scratch/smart-kids-games/spec.md`
Plan: `tasks/plan.md`

## Task 1: Scaffold SvelteKit on Node.js

**Description:** Create the SvelteKit TypeScript app with adapter-vercel, Vitest, env declaration for private `MONGODB_URI`, `.env.example` without secrets, and `.gitignore` for `.env*`.

**Acceptance criteria:**
- [x] `npm run dev`, `npm run build`, `npm run check`, and `npm test` are defined and the empty app builds
- [x] Adapter is Vercel Node.js, not Edge
- [x] `.env.example` lists `MONGODB_URI=` with no password

**Verification:** `npm test`; `npm run build`
**Dependencies:** None
**Files likely touched:** `package.json`, `svelte.config.js`, `src/env.ts`, `.env.example`, `.gitignore`
**Estimated scope:** Medium

## Task 2: Mongo client and document types

**Description:** Server-only `MongoClient` at module scope, `attachDatabasePool`, types for picture slot and play record. Tests mock the driver.

**Acceptance criteria:**
- [x] Client is created once per process; URI from `$app/env/private`
- [x] Types match the spec (no name, email, photo, voice)
- [x] Tests do not open a real Atlas connection

**Verification:** `npm test` for `mongo` / types
**Dependencies:** Task 1
**Files likely touched:** `src/lib/server/mongo.server.ts`, `src/lib/play/types.ts`, `tests/mongo.test.ts`
**Estimated scope:** Medium

## Task 3: Picture slots, notice, erase

**Description:** Empty nests, pick a friend, cookie + Atlas document, first-visit pictures then go, leaf and written notice, long-press confirm erase.

**Acceptance criteria:**
- [x] Four nests; tap empty → friend picker; long-press → confirm → slot and records gone
- [x] Notice pictures appear before the first slot; leaf and labelled link open the written notice
- [x] No name/email stored

**Verification:** Tests for create/erase; `npm run dev` click through notice
**Dependencies:** Task 2
**Files likely touched:** `src/routes/+page.svelte`, `src/routes/+page.server.ts`, `src/lib/play/slots.ts`, `tests/slots.test.ts`
**Estimated scope:** Medium

## Checkpoint: Foundation

- [x] Tests pass, build succeeds
- [x] Slot create and erase work locally (mock or Atlas)
- [x] Review before Home

## Task 4: Language flags

**Description:** Italian and UK flags on Home; speak the language name; persist on the active slot; no flags inside a game yet (no games).

**Acceptance criteria:**
- [x] Tap speaks Italiano / English; chosen flag stays bright
- [x] Slot document stores Home language only

**Verification:** Test language write; listen in the browser
**Dependencies:** Task 3
**Files likely touched:** `src/lib/play/language.ts`, `src/routes/+page.svelte`, `tests/language.test.ts`
**Estimated scope:** Small

## Task 5: Meadow Home cottages and look-only stars

**Description:** Sky row nests + flags; horizontal cottages in spec order; ten stars per cottage from first-finish records. Stars do not open levels.

**Acceptance criteria:**
- [x] Layout matches Meadow (prototype `?variant=A`)
- [x] Stars reflect first finishes; tapping a star on Home does not start a level
- [x] Cottage is inactive until a slot is active

**Verification:** Visual check vs prototype; unit test star counts
**Dependencies:** Task 4
**Files likely touched:** `src/routes/+page.svelte`, `src/lib/play/stars.ts`, `src/lib/play/catalog.ts`, `tests/stars.test.ts`
**Estimated scope:** Medium

## Task 6: Play runtime

**Description:** Entering a cottage copies Home language, starts the next unfinished level, shows in-game replay stars, writes play records, lights a Home star only on first finish, faster-replay voice + wiggle.

**Acceptance criteria:**
- [x] Next unfinished level on enter; finished levels replayable only inside the game
- [x] Slow finish still writes a record and does not fail
- [x] Faster replay wiggles and speaks; first finish does not

**Verification:** Tests for next-level and best-time; stub board in the browser
**Dependencies:** Task 5
**Files likely touched:** `src/lib/play/runtime.ts`, `src/routes/play/[game]/+page.svelte`, `src/routes/play/[game]/+page.server.ts`, `tests/runtime.test.ts`
**Estimated scope:** Medium

## Task 7: Shared SFX

**Description:** Kenney tap / success / miss on the shared actions. Mixkit/Commons loops on Home only.

**Acceptance criteria:**
- [x] Tap, success, miss play from `static/sfx/`
- [x] Home loop does not play inside a game
- [x] No credits screen

**Verification:** Click in the browser; files are CC0/Mixkit SFX/public domain only
**Dependencies:** Task 5
**Files likely touched:** `src/lib/play/sfx.ts`, `static/sfx/`, `src/routes/+page.svelte`
**Estimated scope:** Small

## Checkpoint: Home & play

- [x] Pick nest, switch language, open a stub game, finish once, see a star, replay faster
- [x] Review before real games

## Task 8: Paint

**Description:** Region fill by tap or drag, nine families, Paint friends table, free-style sheet with no stars.

**Acceptance criteria:**
- [x] Levels 1 and 10 match the spec table
- [x] Wrong family does not stay; free style does not light stars

**Verification:** `npm test` for families; browser fill level 1
**Dependencies:** Task 6, Task 7
**Files likely touched:** `src/lib/games/paint.ts`, `src/lib/games/PaintBoard.svelte`, `tests/paint.test.ts`
**Estimated scope:** Medium

## Task 9: Memory

**Description:** Pairs 2→6, preview/voice/pause fade, extra apple then ball.

**Acceptance criteria:**
- [x] Mismatch does not fail; level completes when all pairs are up
- [x] Level 10 has 6 pairs and no preview

**Verification:** Tests for pair counts; browser level 1
**Dependencies:** Task 6
**Files likely touched:** `src/lib/games/memory.ts`, `src/lib/games/MemoryBoard.svelte`, `tests/memory.test.ts`
**Estimated scope:** Medium

## Task 10: Picture quiz engine and Animal Quiz

**Description:** Hear name, tap picture, 4 correct taps, 2→4 pictures, glow/repeat fade. Animal Quiz uses four friends.

**Acceptance criteria:**
- [x] Wrong tap does not stay; four correct taps finish
- [x] Language copied at enter is the spoken language

**Verification:** Tests for the quiz table; browser Animal Quiz level 1
**Dependencies:** Task 6
**Files likely touched:** `src/lib/games/quiz.ts`, `src/lib/games/QuizBoard.svelte`, `tests/quiz.test.ts`
**Estimated scope:** Medium

## Task 11: Other picture quizzes

**Description:** Wire vehicles, food, shapes, clothes, toys, instruments onto the quiz engine with the locked picture sets.

**Acceptance criteria:**
- [x] Each cottage uses the same table, different pictures and names
- [x] Color & Shape accepts color or shape name uniquely

**Verification:** One test per quiz content module; spot-check Food in the browser
**Dependencies:** Task 10
**Files likely touched:** `src/lib/games/quizContent.ts`, `src/lib/play/catalog.ts`, `tests/quizContent.test.ts`
**Estimated scope:** Medium

## Task 12: Quick Count

**Description:** Group to dots, no digits, 1–2 through 5, count-along fade, four matches a level.

**Acceptance criteria:**
- [x] No numeric glyphs; wrong dots do not stay
- [x] Level 10 allows up to 5 objects and 4 answers, no count-along

**Verification:** Tests for ranges; browser level 1
**Dependencies:** Task 6
**Files likely touched:** `src/lib/games/count.ts`, `src/lib/games/CountBoard.svelte`, `tests/count.test.ts`
**Estimated scope:** Medium

## Checkpoint: First four games

- [x] Paint, Memory, Animal Quiz, Quick Count playable 1 and 10
- [x] Review before the rest of the catalog

## Task 13: Math

**Description:** Two groups join; dots for the total; max 5; four joins a level.

**Acceptance criteria:**
- [x] Distinct from Quick Count (two groups, not one)
- [x] No digits

**Verification:** Tests for totals; browser 1+1
**Dependencies:** Task 12
**Files likely touched:** `src/lib/games/math.ts`, `src/lib/games/MathBoard.svelte`, `tests/math.test.ts`
**Estimated scope:** Medium

## Task 14: Little Phrase

**Description:** Two ideas, word order follows copied language, one-idea then both-ideas.

**Acceptance criteria:**
- [x] English “red ball” / Italian “palla rossa”
- [x] No Grammar cottages

**Verification:** Tests for agreement; browser both languages
**Dependencies:** Task 10
**Files likely touched:** `src/lib/games/phrase.ts`, `src/lib/games/PhraseBoard.svelte`, `tests/phrase.test.ts`
**Estimated scope:** Medium

## Task 15: Stickers

**Description:** Stickers onto outlines, 1→8, no free sheet.

**Acceptance criteria:**
- [x] Wrong outline does not keep the sticker
- [x] Finishing lights Stickers stars, not extra rewards

**Verification:** Tests for counts; browser level 1
**Dependencies:** Task 6
**Files likely touched:** `src/lib/games/stickers.ts`, `src/lib/games/StickersBoard.svelte`, `tests/stickers.test.ts`
**Estimated scope:** Medium

## Task 16: Sorting

**Description:** Two baskets; size then color; 2→6 pictures.

**Acceptance criteria:**
- [x] Levels 1–5 size, 6–10 color
- [x] Wrong basket does not keep the picture

**Verification:** Tests for rules; browser level 1
**Dependencies:** Task 6
**Files likely touched:** `src/lib/games/sorting.ts`, `src/lib/games/SortBoard.svelte`, `tests/sorting.test.ts`
**Estimated scope:** Medium

## Task 17: Category Sort

**Description:** Two pictured baskets by kind; far then closer kinds.

**Acceptance criteria:**
- [x] Not size or color
- [x] Kind table matches the spec

**Verification:** Tests for kind pairs; browser food vs vehicles
**Dependencies:** Task 16
**Files likely touched:** `src/lib/games/categories.ts`, `src/lib/games/CategoryBoard.svelte`, `tests/categories.test.ts`
**Estimated scope:** Medium

## Task 18: Speed Match and Shadow Match

**Description:** Sample full picture vs full choices; then full picture vs shadows. Same 2→4 / 4-taps / closer lookalikes tables.

**Acceptance criteria:**
- [x] Speed Match has no spoken name and no fail-on-slow
- [x] Shadow Match uses silhouettes, not two full pictures

**Verification:** Tests for both tables; browser one level each
**Dependencies:** Task 6
**Files likely touched:** `src/lib/games/speed.ts`, `src/lib/games/shadow.ts`, `src/lib/games/MatchBoard.svelte`, `tests/match.test.ts`
**Estimated scope:** Medium

## Task 19: What Comes Next

**Description:** ABAB then ABCABC gap fill.

**Acceptance criteria:**
- [x] Four gaps a level; wrong choice does not stay
- [x] Pattern switch at level 6

**Verification:** Tests for patterns; browser level 1
**Dependencies:** Task 6
**Files likely touched:** `src/lib/games/next.ts`, `src/lib/games/NextBoard.svelte`, `tests/next.test.ts`
**Estimated scope:** Medium

## Task 20: Path Builder and Jigsaw

**Description:** Tap-next-square path; chunk-on-ghost jigsaw. Two boards, shared runtime.

**Acceptance criteria:**
- [x] Path: straight then bends then decoy; wrong square does not stay
- [x] Jigsaw: 2→6 chunks; ghost fades; not Stickers

**Verification:** Tests for tap counts and chunk counts; browser level 1 each
**Dependencies:** Task 6
**Files likely touched:** `src/lib/games/path.ts`, `src/lib/games/jigsaw.ts`, `src/lib/games/PathBoard.svelte`, `src/lib/games/JigsawBoard.svelte`, `tests/pathJigsaw.test.ts`
**Estimated scope:** Medium

## Task 21: Odd One Out and Sound Safari

**Description:** Tap the one that does not belong; hear thing-sound and tap. Mixkit/Freesound CC0 for Safari; no rabbit.

**Acceptance criteria:**
- [x] Odd One Out 3→4 pictures, far then closer kinds
- [x] Sound Safari uses thing-sounds, not spoken names; bird/cat/dog then car/train/drum/piano

**Verification:** Tests for both; browser level 1 each
**Dependencies:** Task 7, Task 10
**Files likely touched:** `src/lib/games/odd.ts`, `src/lib/games/safari.ts`, `static/sfx/safari/`, `tests/oddSafari.test.ts`
**Estimated scope:** Medium

## Task 22: Replace placeholders with studio files

**Description:** Drop in FLUX.2-klein 4B pictures and Qwen3-TTS lines for friends and spoken UI. App code should not change except asset paths if needed.

**Acceptance criteria:**
- [x] No studio HTTP from the client
- [x] Original friends only

**Verification:** Visual/audio pass on Home and Paint
**Dependencies:** Tasks 8–21
**Files likely touched:** `static/art/`, `static/voice/`
**Estimated scope:** Small (files only)

## Checkpoint: Complete

- [x] All spec success criteria
- [x] `npm test` and `npm run build`
- [x] Ready to deploy on Vercel with `MONGODB_URI` set in the dashboard

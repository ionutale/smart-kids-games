<script lang="ts">
	import { untrack } from 'svelte';
	import SimplePic from '../play/SimplePic.svelte';
	import {
		CLOTHES,
		COLOR_FAMILIES,
		FAMILY_NAME,
		FAMILY_SWATCH,
		FOOD,
		FRIENDS,
		INSTRUMENTS,
		NAMES,
		QUIZ_SETS,
		SHAPE_NAMES,
		TOYS,
		VEHICLES,
		type ColorFamily,
		type PicId
	} from '../play/pictures.ts';
	import { playSfx } from '../play/sfx.ts';
	import type { FriendArtId, GameId, Language, Level } from '../play/types.ts';
	import { CATEGORY_PROMPT, ODD_PROMPT, PATH_PROMPT, SORT_PROMPT, WEATHER_PROMPT } from '../play/language.ts';
	import { WEATHER_NAME, WEATHER_POOLS, type WeatherId } from '../play/weather.ts';
	import { speak } from '../play/voice.ts';
	import { pick, range, shuffle } from './rand.ts';
	import { pathBoard } from './path.ts';
	import PaintOutline from './PaintOutline.svelte';
	import JigsawChunk from './JigsawChunk.svelte';
	import WeatherIcon from './WeatherIcon.svelte';
	import WeatherScene from './WeatherScene.svelte';
	import BasketBin from './BasketBin.svelte';
	import BuddyAsk from './BuddyAsk.svelte';
	import { JIGSAW_BOARD, jigsawPad, jigsawShape } from './jigsaw.ts';
	import {
		CATEGORY_LEVELS,
		COUNT_LEVELS,
		JIGSAW_LEVELS,
		MATH_LEVELS,
		MEMORY_LEVELS,
		MEMORY_EXTRAS,
		NEXT_LEVELS,
		ODD_LEVELS,
		PAINT_LEVELS,
		PAINT_REGIONS,
		PATH_LEVELS,
		PHRASE_LEVELS,
		QUIZ_LEVELS,
		SAFARI_POOLS,
		SORTING_LEVELS,
		SHADOW_LEVELS,
		SPEED_LEVELS,
		STICKERS_LEVELS,
		paintPalette
	} from './tables.ts';

	let {
		game,
		level,
		language,
		artId = 'bird',
		free = false,
		onFinished
	}: {
		game: GameId;
		level: Level;
		language: Language;
		artId?: FriendArtId;
		free?: boolean;
		onFinished: () => void;
	} = $props();

	const KIND_PICS: Record<string, PicId[]> = {
		friends: FRIENDS,
		vehicles: VEHICLES,
		food: FOOD,
		clothes: CLOTHES,
		toys: TOYS,
		instruments: INSTRUMENTS
	};

	const KIND_NAME: Record<string, Record<'en' | 'it', string>> = {
		friends: { en: 'Friends', it: 'Amici' },
		vehicles: { en: 'Vehicles', it: 'Mezzi' },
		food: { en: 'Food', it: 'Cibo' },
		clothes: { en: 'Clothes', it: 'Vestiti' },
		toys: { en: 'Toys', it: 'Giochi' },
		instruments: { en: 'Instruments', it: 'Strumenti' }
	};

	let needed = $state(4);
	let got = $state(0);
	let question = $state(0);
	let glowFirst = $state(true);
	let selected = $state<number | string | null>(null);
	let fills = $state<Array<ColorFamily | null>>([]);
	let palette = $state<ColorFamily[]>([]);
	let cards = $state<PicId[]>([]);
	let up = $state<boolean[]>([]);
	let firstFlip = $state<number | null>(null);
	let choices = $state<PicId[]>([]);
	let target = $state<PicId>('bird');
	let extras = $state<PicId[]>([]);
	let dots = $state<number[]>([]);
	let total = $state(1);
	let left = $state(1);
	let right = $state(1);
	let phrase = $state('');
	let phrasePics = $state<Array<{ pic: PicId; color: ColorFamily }>>([]);
	let phraseTarget = $state(0);
	let stickers = $state<PicId[]>([]);
	let placed = $state<Array<PicId | null>>([]);
	let sortItems = $state<Array<{ pic: PicId; bucket: 0 | 1; size?: 'big' | 'small'; color?: ColorFamily }>>([]);
	let sortPlaced = $state<Array<0 | 1 | null>>([]);
	let sample = $state<PicId>('bird');
	let row = $state<PicId[]>([]);
	let gap = $state<PicId>('bird');
	let path = $state<number[]>([]);
	let pathStep = $state(0);
	let pathCols = $state(2);
	let pathRows = $state(1);
	let decoy = $state<number | null>(null);
	let chunks = $state<number[]>([]);
	let chunkPlaced = $state<Array<number | null>>([]);
	let oddPics = $state<PicId[]>([]);
	let oddIndex = $state(0);
	let weatherChoices = $state<WeatherId[]>([]);
	let weatherTarget = $state<WeatherId>('sun');
	let holding = $state(false);
	let skipClick = $state(false);
	let mood = $state<'idle' | 'happy' | 'sad'>('idle');
	let lastCue = $state('');
	let drag = $state<{
		kind: 'paint' | 'sticker' | 'sort' | 'jigsaw';
		payload: string | number;
		pic?: PicId;
		family?: ColorFamily;
		x: number;
		y: number;
		originX: number;
		originY: number;
		moved: boolean;
	} | null>(null);

	function grab(
		event: PointerEvent,
		next: { kind: 'paint' | 'sticker' | 'sort' | 'jigsaw'; payload: string | number; pic?: PicId; family?: ColorFamily }
	) {
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
		drag = {
			...next,
			x: event.clientX,
			y: event.clientY,
			originX: event.clientX,
			originY: event.clientY,
			moved: false
		};
	}

	function moveDrag(event: PointerEvent) {
		if (!drag) return;
		const moved = drag.moved || Math.hypot(event.clientX - drag.originX, event.clientY - drag.originY) > 10;
		drag = { ...drag, moved, x: event.clientX, y: event.clientY };
	}

	function dropOn(event: PointerEvent) {
		const hit = document.elementFromPoint(event.clientX, event.clientY);
		return (hit instanceof Element ? hit.closest('[data-drop]') : null)?.getAttribute('data-drop') ?? '';
	}

	function dropDrag(event: PointerEvent) {
		if (!drag) return;
		const current = drag;
		drag = null;
		if (current.moved) {
			const drop = dropOn(event);
			if (current.kind === 'paint' && current.family && drop.startsWith('paint-')) {
				paintAt(Number(drop.slice(6)), current.family);
				skipClick = true;
				return;
			}
			if (current.kind === 'sticker' && drop.startsWith('sticker-')) {
				tapSticker(current.payload as PicId, Number(drop.slice(8)));
				skipClick = true;
				return;
			}
			if (current.kind === 'sort' && drop.startsWith('basket-')) {
				tapBucket(Number(current.payload), Number(drop.slice(7)) as 0 | 1);
				skipClick = true;
				return;
			}
			if (current.kind === 'jigsaw' && drop.startsWith('jigsaw-')) {
				tapChunk(Number(current.payload), Number(drop.slice(7)));
				skipClick = true;
				return;
			}
		}
		if (current.kind === 'paint' && current.family) paintFill(current.family);
		else if (current.kind === 'sticker') selected = current.payload as PicId;
		else if (current.kind === 'sort') selected = Number(current.payload);
		else if (current.kind === 'jigsaw') selected = Number(current.payload);
		skipClick = true;
	}

	function tapOrSkip(action: () => void) {
		if (skipClick) {
			skipClick = false;
			return;
		}
		action();
	}

	function cue(kind: 'tap' | 'success' | 'miss') {
		playSfx(kind);
	}

	function winRound() {
		got += 1;
		cue('success');
		mood = 'happy';
		if (got >= needed) onFinished();
		else nextQuestion();
	}

	function miss() {
		cue('miss');
		mood = 'sad';
	}

	function say(text: string) {
		lastCue = text;
		speak(text, language);
	}

	function hearBuddy() {
		if (game === 'sound-safari') {
			playSfx('safari', target);
			return;
		}
		if (lastCue) {
			say(lastCue);
			return;
		}
		if (game === 'weather') say(WEATHER_PROMPT[language]);
		else if (game === 'path') say(PATH_PROMPT[language]);
		else if (game === 'odd-one-out') say(ODD_PROMPT[language]);
		else if (game === 'categories') say(CATEGORY_PROMPT[language]);
		else if (game === 'sorting') say(SORT_PROMPT[language]);
	}

	function quizSet(): PicId[] {
		if (game === 'animals') return FRIENDS;
		return QUIZ_SETS[game] ?? FRIENDS;
	}

	function nextQuestion() {
		question += 1;
		glowFirst = question === 1;
		selected = null;
		if (['animals', 'vehicles', 'food', 'shapes', 'clothes', 'toys', 'instruments'].includes(game)) {
			const set = quizSet();
			const help = QUIZ_LEVELS[level];
			choices = pick(set, help.pictures);
			target = choices[0]!;
			choices = shuffle(choices);
			const name =
				game === 'shapes' && Math.random() < 0.5
					? SHAPE_NAMES[target][language]
					: NAMES[target][language];
			say(name);
			if (help.repeat) setTimeout(() => say(name), help.waitMs);
		} else if (game === 'speed' || game === 'shadow') {
			const help = game === 'shadow' ? SHADOW_LEVELS[level] : SPEED_LEVELS[level];
			const pool = help.closeness === 'far' ? [...FRIENDS, ...VEHICLES] : [...FRIENDS, ...VEHICLES, ...FOOD];
			choices = pick(pool, help.choices);
			sample = choices[0]!;
			target = sample;
			choices = shuffle(choices);
		} else if (game === 'little-phrase') {
			setupPhrase();
		} else if (game === 'count') {
			setupCount();
		} else if (game === 'math') {
			setupMath();
		} else if (game === 'next') {
			setupNext();
		} else if (game === 'odd-one-out') {
			setupOdd();
		} else if (game === 'sound-safari') {
			setupSafari();
		} else if (game === 'weather') {
			setupWeather();
		}
	}

	function setupPaint() {
		const regions = free ? Array.from({ length: 4 }, () => 'white' as ColorFamily) : PAINT_REGIONS[level];
		fills = regions.map(() => null);
		palette = free ? (Object.keys(FAMILY_SWATCH) as ColorFamily[]) : paintPalette(level);
		needed = 1;
		got = 0;
		if (!free && PAINT_LEVELS[level].voice) say(FAMILY_NAME[PAINT_REGIONS[level][0]!][language]);
	}

	function setupMemory() {
		const help = MEMORY_LEVELS[level];
		const pool: PicId[] = [...FRIENDS, ...MEMORY_EXTRAS].slice(0, help.pairs);
		cards = shuffle([...pool, ...pool]);
		up = cards.map(() => help.previewMs > 0);
		if (help.previewMs > 0) setTimeout(() => (up = cards.map(() => false)), help.previewMs);
		if (help.voice) pool.forEach((pic, i) => setTimeout(() => say(NAMES[pic][language]), 400 * i));
		needed = 1;
		got = 0;
	}

	function setupCount() {
		const help = COUNT_LEVELS[level];
		total = range(help.min, help.max);
		const answers = new Set([total]);
		while (answers.size < help.answers) answers.add(range(1, 5));
		dots = shuffle([...answers]);
		extras = Array.from({ length: total }, () => 'apple' as PicId);
		if (help.countAlong) say(language === 'it' ? `${total}` : `${total}`);
	}

	function setupMath() {
		const help = MATH_LEVELS[level];
		const max = help.maxTotal;
		left = range(1, max - 1);
		right = range(1, max - left);
		if (left + right < help.minTotal) right = help.minTotal - left;
		total = left + right;
		const answers = new Set([total]);
		while (answers.size < help.answers) answers.add(range(1, 5));
		dots = shuffle([...answers]);
	}

	function setupPhrase() {
		const help = PHRASE_LEVELS[level];
		const colors: ColorFamily[] = ['red', 'yellow', 'blue', 'green'];
		const things: PicId[] = ['ball', 'apple', 'car', 'hat'];
		const color = pick(colors, 1)[0]!;
		const thing = pick(things, 1)[0]!;
		phrasePics = pick(
			colors.flatMap((c) => things.map((t) => ({ pic: t, color: c }))),
			help.pictures
		);
		if (!phrasePics.some((item) => item.pic === thing && item.color === color)) {
			phrasePics[0] = { pic: thing, color };
		}
		phrasePics = shuffle(phrasePics);
		phraseTarget = phrasePics.findIndex((item) => item.pic === thing && item.color === color);
		const colorWord = FAMILY_NAME[color][language];
		const thingWord = NAMES[thing][language];
		phrase = language === 'it' ? `${thingWord} ${colorWord}` : `${colorWord} ${thingWord}`;
		say(phrase);
		if (help.repeat) setTimeout(() => say(phrase), help.waitMs);
	}

	function setupStickers() {
		const help = STICKERS_LEVELS[level];
		stickers = pick([...FRIENDS, ...FOOD, ...TOYS], help.count);
		placed = stickers.map(() => null);
		needed = 1;
		got = 0;
		if (help.voice) say(NAMES[stickers[0]!][language]);
	}

	function setupSort() {
		const help = SORTING_LEVELS[level];
		const pool = shuffle([...FRIENDS, ...FOOD, ...TOYS, ...VEHICLES, ...CLOTHES, ...INSTRUMENTS]);
		const pics = pool.slice(0, help.pictures);
		const split = Math.floor(help.pictures / 2);
		if (help.rule === 'size') {
			sortItems = pics.map((pic, i) => ({
				pic,
				bucket: (i < split ? 0 : 1) as 0 | 1,
				size: (i < split ? 'big' : 'small') as 'big' | 'small'
			}));
		} else {
			const [c0, c1] = help.colors ?? (['red', 'yellow'] as [ColorFamily, ColorFamily]);
			sortItems = pics.map((pic, i) => ({
				pic,
				bucket: (i < split ? 0 : 1) as 0 | 1,
				color: i < split ? c0 : c1
			}));
		}
		sortItems = shuffle(sortItems);
		sortPlaced = sortItems.map(() => null);
		needed = 1;
		got = 0;
		if (help.voice) {
			if (help.rule === 'size') say(language === 'it' ? 'Grande o piccolo' : 'Big or small');
			else {
				const [c0, c1] = sortColors();
				say(`${FAMILY_NAME[c0][language]} ${FAMILY_NAME[c1][language]}`);
			}
		}
	}

	function setupCategory() {
		const help = CATEGORY_LEVELS[level];
		const [a, b] = help.kinds;
		const first = pick(KIND_PICS[a] ?? FOOD, Math.ceil(help.pictures / 2)).map((pic) => ({ pic, bucket: 0 as const }));
		const second = pick(KIND_PICS[b] ?? TOYS, help.pictures - first.length).map((pic) => ({ pic, bucket: 1 as const }));
		sortItems = shuffle([...first, ...second]);
		sortPlaced = sortItems.map(() => null);
		needed = 1;
		got = 0;
	}

	function setupNext() {
		const help = NEXT_LEVELS[level];
		const unit = help.pattern === 'AB' ? pick(FRIENDS, 2) : pick(FRIENDS, 3);
		row = Array.from({ length: help.shown }, (_, i) => unit[i % unit.length]!);
		gap = unit[help.shown % unit.length]!;
		const wrong = pick(
			FRIENDS.filter((pic) => pic !== gap),
			help.choices - 1
		);
		choices = shuffle([gap, ...wrong]);
		if (help.voice) say(row.map((pic) => NAMES[pic][language]).join(' '));
	}

	function setupPath() {
		const help = PATH_LEVELS[level];
		const board = pathBoard(help.taps, help.shape, help.decoy);
		path = board.path;
		pathCols = board.cols;
		pathRows = board.rows;
		decoy = board.decoy;
		pathStep = 0;
		needed = 1;
		got = 0;
	}

	function setupJigsaw() {
		const help = JIGSAW_LEVELS[level];
		const pool: PicId[] = [...FRIENDS, 'apple', 'car', 'drum', 'shirt', 'ball', 'train'];
		sample = pool[(level - 1) % pool.length]!;
		chunks = shuffle(Array.from({ length: help.chunks }, (_, i) => i));
		chunkPlaced = Array.from({ length: help.chunks }, () => null);
		needed = 1;
		got = 0;
		if (help.voice) say(NAMES[sample][language]);
	}

	function setupOdd() {
		const help = ODD_LEVELS[level];
		const [main, other] = help.kinds;
		const mains = pick(KIND_PICS[main] ?? FOOD, help.pictures - 1);
		const odd = pick(KIND_PICS[other] ?? VEHICLES, 1)[0]!;
		oddPics = shuffle([...mains, odd]);
		oddIndex = oddPics.indexOf(odd);
	}

	function setupWeather() {
		const help = QUIZ_LEVELS[level];
		const pool = WEATHER_POOLS[level];
		weatherChoices = pick(pool, Math.min(help.pictures, pool.length));
		weatherTarget = weatherChoices[0]!;
		weatherChoices = shuffle(weatherChoices);
	}

	function setupSafari() {
		const help = QUIZ_LEVELS[level];
		const pool = SAFARI_POOLS[level];
		choices = pick(pool, help.pictures);
		target = choices[0]!;
		choices = shuffle(choices);
		playSfx('safari', target);
		if (help.repeat) setTimeout(() => playSfx('safari', target), help.waitMs);
	}

	function boot() {
		got = 0;
		question = 0;
		selected = null;
		firstFlip = null;
		holding = false;
		mood = 'idle';
		lastCue = '';
		if (game === 'paint') setupPaint();
		else if (game === 'memory') setupMemory();
		else if (game === 'stickers') setupStickers();
		else if (game === 'sorting') setupSort();
		else if (game === 'categories') setupCategory();
		else if (game === 'path') setupPath();
		else if (game === 'jigsaw') setupJigsaw();
		else {
			needed = 4;
			got = 0;
			question = 0;
			nextQuestion();
		}
	}

	$effect(() => {
		game;
		level;
		language;
		free;
		untrack(() => boot());
	});

	$effect(() => {
		if (mood === 'idle') return;
		const wait = setTimeout(() => (mood = 'idle'), 700);
		return () => clearTimeout(wait);
	});

	function glowOn(firstOnly: 'yes' | 'first' | 'no') {
		if (firstOnly === 'no') return false;
		if (firstOnly === 'first') return glowFirst;
		return true;
	}

	function paintAt(index: number, family: ColorFamily) {
		cue('tap');
		if (!free && PAINT_REGIONS[level][index] !== family) {
			miss();
			fills[index] = null;
			selected = null;
			return;
		}
		fills[index] = family;
		selected = null;
		if (!free && fills.every((fill, i) => fill === PAINT_REGIONS[level][i])) {
			cue('success');
			onFinished();
		}
	}

	function paintFill(family: ColorFamily) {
		if (selected !== null && typeof selected === 'number') {
			paintAt(Number(selected), family);
			selected = null;
			return;
		}
		cue('tap');
		selected = family;
	}

	function tapPaintRegion(index: number) {
		if (typeof selected === 'string' && (COLOR_FAMILIES as readonly string[]).includes(selected)) {
			paintAt(index, selected as ColorFamily);
			return;
		}
		cue('tap');
		selected = index;
	}

	function flip(i: number) {
		if (up[i] || holding) return;
		cue('tap');
		up[i] = true;
		if (firstFlip === null) {
			firstFlip = i;
			return;
		}
		const a = firstFlip;
		firstFlip = null;
		if (cards[a] === cards[i]) {
			cue('success');
			if (up.every(Boolean)) onFinished();
			return;
		}
		miss();
		holding = true;
		const pause = MEMORY_LEVELS[level].pauseMs;
		setTimeout(() => {
			up[a] = false;
			up[i] = false;
			holding = false;
		}, pause || 80);
	}

	function tapChoice(pic: PicId) {
		cue('tap');
		if (pic === target || pic === gap) winRound();
		else miss();
	}

	function tapDots(n: number) {
		cue('tap');
		if (n === total) winRound();
		else miss();
	}

	function tapPhrase(i: number) {
		cue('tap');
		if (i === phraseTarget) winRound();
		else miss();
	}

	function tapSticker(pic: PicId, outline: number) {
		cue('tap');
		if (stickers[outline] !== pic) {
			miss();
			return;
		}
		placed[outline] = pic;
		if (placed.every(Boolean)) {
			cue('success');
			onFinished();
		} else cue('success');
	}

	function tapBucket(index: number, bucket: 0 | 1) {
		cue('tap');
		if (sortItems[index]?.bucket !== bucket) {
			miss();
			return;
		}
		sortPlaced[index] = bucket;
		selected = null;
		if (sortPlaced.every((value) => value !== null)) {
			cue('success');
			onFinished();
		} else cue('success');
	}

	function tapPath(cell: number) {
		cue('tap');
		if (cell === path[pathStep + 1]) {
			pathStep += 1;
			if (pathStep === path.length - 1) {
				cue('success');
				onFinished();
			} else cue('success');
		} else miss();
	}

	function tapChunk(chunk: number, place: number) {
		cue('tap');
		if (chunk !== place) {
			miss();
			return;
		}
		chunkPlaced[place] = chunk;
		if (chunkPlaced.every((value) => value !== null)) {
			cue('success');
			onFinished();
		} else cue('success');
	}

	function tapOdd(i: number) {
		cue('tap');
		if (i === oddIndex) winRound();
		else miss();
	}

	function tapWeather(kind: WeatherId) {
		cue('tap');
		if (kind === weatherTarget) winRound();
		else miss();
	}

	function basketGlow(bucket: number) {
		const on = game === 'sorting' ? SORTING_LEVELS[level].glow : CATEGORY_LEVELS[level].glow;
		if (!on || selected === null || typeof selected !== 'number') return false;
		return sortItems[Number(selected)]?.bucket === bucket;
	}

	function sortColors(): [ColorFamily, ColorFamily] {
		return SORTING_LEVELS[level].colors ?? ['red', 'yellow'];
	}

	function basketLabel(bucket: number) {
		if (game === 'sorting' && SORTING_LEVELS[level].rule === 'size') {
			return bucket === 0 ? (language === 'it' ? 'grande' : 'big') : language === 'it' ? 'piccolo' : 'small';
		}
		if (game === 'sorting') {
			return FAMILY_NAME[sortColors()[bucket]][language];
		}
		const kind = CATEGORY_LEVELS[level].kinds[bucket] ?? 'food';
		return KIND_NAME[kind]?.[language] ?? kind;
	}

	function basketSample(bucket: number): PicId {
		const kind = CATEGORY_LEVELS[level].kinds[bucket] ?? 'food';
		return (KIND_PICS[kind] ?? FOOD)[0]!;
	}

	const quizLike = [
		'animals',
		'vehicles',
		'food',
		'shapes',
		'clothes',
		'toys',
		'instruments',
		'speed',
		'shadow',
		'sound-safari'
	];

	const progress = $derived(
		game === 'paint'
			? fills.filter(Boolean).length
			: game === 'memory'
				? up.filter(Boolean).length
				: game === 'stickers'
					? placed.filter(Boolean).length
					: game === 'sorting' || game === 'categories'
						? sortPlaced.filter((value) => value !== null).length
						: game === 'path'
							? pathStep
							: game === 'jigsaw'
								? chunkPlaced.filter((value) => value !== null).length
								: got
	);

	const jig = $derived(jigsawShape(Math.max(chunkPlaced.length, 1)));
	const jigSlotW = $derived(JIGSAW_BOARD / jig.cols);
	const jigSlotH = $derived(JIGSAW_BOARD / jig.rows);
	const jigPad = $derived(jigsawPad(jigSlotW, jigSlotH));
</script>

<div class="board" data-testid="board" data-game={game} data-level={level} data-progress={progress}>
	{#if !free}
		<BuddyAsk
			{artId}
			{mood}
			listen={game !== 'speed' && game !== 'shadow'}
			hearLabel={language === 'it' ? 'ascolta' : 'hear'}
			hearTestId={game === 'sound-safari' ? 'hear' : 'buddy-hear'}
			onHear={hearBuddy}
		>
			{#if game === 'speed' || game === 'shadow'}
				<SimplePic pic={sample} size={72} shadow={false} />
			{:else if game === 'count' || game === 'math' || game === 'next'}
				<span class="ask-q">?</span>
			{:else}
				<svg viewBox="0 0 100 100" width="56" height="56" aria-hidden="true">
					<polygon points="18,38 42,38 64,18 64,82 42,62 18,62" fill="#3c342b" />
					<path d="M74 36 C84 44 84 56 74 64" fill="none" stroke="#3c342b" stroke-width="5" stroke-linecap="round" />
					<path d="M82 26 C98 40 98 60 82 74" fill="none" stroke="#3c342b" stroke-width="5" stroke-linecap="round" />
				</svg>
			{/if}
		</BuddyAsk>
		{#if needed > 1}
			<div class="treats" data-testid="treats" aria-hidden="true">
				{#each Array(needed) as _, i}
					<i class="treat" class:got={i < got}></i>
				{/each}
			</div>
		{/if}
	{/if}
	{#if game === 'paint'}
		<PaintOutline {level} {fills} {selected} {free} onPick={tapPaintRegion} />
		<div class="row">
			{#each palette as family}
				<button
					class="swatch"
					class:glow={!free && selected === family}
					style="background:{FAMILY_SWATCH[family]}"
					data-family={family}
					data-correct={!free && selected !== null && typeof selected === 'number' && PAINT_REGIONS[level][Number(selected)] === family
						? 'true'
						: undefined}
					aria-label={FAMILY_NAME[family][language]}
					onpointerdown={(event) => grab(event, { kind: 'paint', payload: family, family })}
					onpointermove={moveDrag}
					onpointerup={dropDrag}
					onpointercancel={() => (drag = null)}
					onclick={() => tapOrSkip(() => paintFill(family))}
				></button>
			{/each}
		</div>
	{:else if game === 'memory'}
		<div class="grid">
			{#each cards as pic, i}
				<button
					class="card"
					class:up={up[i]}
					data-pic={pic}
					data-testid="card-{i}"
					aria-label={up[i] ? NAMES[pic][language] : 'card'}
					onclick={() => flip(i)}
				>
					{#if up[i]}<SimplePic {pic} />{/if}
				</button>
			{/each}
		</div>
	{:else if quizLike.includes(game)}
		<div class="row">
			{#each choices as pic}
				<button
					class="choice"
					class:glow={glowOn(
						game === 'shadow'
							? SHADOW_LEVELS[level].glow
							: game === 'speed'
								? SPEED_LEVELS[level].glow
								: QUIZ_LEVELS[level].glow
					) &&
						(pic === target || pic === sample)}
					data-pic={pic}
					data-correct={pic === target ? 'true' : undefined}
					aria-label={NAMES[pic][language]}
					onclick={() => tapChoice(pic)}
				>
					<SimplePic {pic} size={88} shadow={game === 'shadow'} />
				</button>
			{/each}
		</div>
	{:else if game === 'count' || game === 'math'}
		<div class="row wrap">
			{#if game === 'math'}
				<div class="plate" data-testid="plate">
					{#each Array(left) as _}
						<SimplePic pic="apple" size={48} />
					{/each}
				</div>
				<span class="plus">+</span>
				<div class="plate">
					{#each Array(right) as _}
						<SimplePic pic="apple" size={48} />
					{/each}
				</div>
			{:else}
				<div class="plate" data-testid="plate">
					{#each extras as pic}
						<SimplePic {pic} size={56} />
					{/each}
				</div>
			{/if}
		</div>
		<div class="row">
			{#each dots as n}
				<button
					class="choice num"
					class:glow={glowOn(game === 'math' ? MATH_LEVELS[level].glow : COUNT_LEVELS[level].glow) && n === total}
					data-correct={n === total ? 'true' : undefined}
					data-n={n}
					aria-label={String(n)}
					onclick={() => tapDots(n)}
				>
					<span class="digit">{n}</span>
				</button>
			{/each}
		</div>
	{:else if game === 'little-phrase'}
		<div class="row">
			{#each phrasePics as item, i}
				<button
					class="choice"
					class:glow={glowOn(PHRASE_LEVELS[level].glow) && i === phraseTarget}
					style="outline: 6px solid {FAMILY_SWATCH[item.color]}"
					data-correct={i === phraseTarget ? 'true' : undefined}
					aria-label="{FAMILY_NAME[item.color][language]} {NAMES[item.pic][language]}"
					onclick={() => tapPhrase(i)}
				>
					<SimplePic pic={item.pic} size={84} />
				</button>
			{/each}
		</div>
	{:else if game === 'stickers'}
		<div class="row">
			{#each stickers as pic, i}
				<button
					class="outline"
					class:glow={STICKERS_LEVELS[level].glow && selected === pic}
					data-pic={pic}
					data-drop="sticker-{i}"
					aria-label="outline {i + 1}"
					onclick={() => selected && tapSticker(selected as PicId, i)}
				>
					{#if placed[i]}<SimplePic pic={placed[i]!} />{:else}<span class="ghost"><SimplePic {pic} /></span>{/if}
				</button>
			{/each}
		</div>
		<div class="row">
			{#each stickers as pic}
				<button
					class="choice"
					data-pic={pic}
					aria-label={NAMES[pic][language]}
					onpointerdown={(event) => grab(event, { kind: 'sticker', payload: pic, pic })}
					onpointermove={moveDrag}
					onpointerup={dropDrag}
					onpointercancel={() => (drag = null)}
					onclick={() => tapOrSkip(() => (selected = pic))}
				>
					<SimplePic {pic} size={84} />
				</button>
			{/each}
		</div>
	{:else if game === 'sorting' || game === 'categories'}
		{#if game === 'sorting'}
			<div class="howto" data-testid="howto">
				<span class="mini" data-testid="sort-pic-example" aria-hidden="true">
					<SimplePic pic="apple" size={SORTING_LEVELS[level].rule === 'size' ? 40 : 28} />
					<svg class="tap" viewBox="0 0 48 48" width="28" height="28" aria-hidden="true">
						<ellipse cx="28" cy="38" rx="10" ry="6" fill="#f4c7a5" stroke="#3c342b" stroke-width="2" />
						<path
							d="M22 36 L22 16 C22 12 28 12 28 16 L28 22 L30 10 C30 7 34 7 34 11 L34 22 L36 14 C36 11 40 11 40 15 L40 28 C40 36 34 40 26 40 L22 36 Z"
							fill="#f4c7a5"
							stroke="#3c342b"
							stroke-width="2"
						/>
					</svg>
				</span>
				<svg class="path-arrow" viewBox="0 0 48 24" width="36" height="18" aria-hidden="true">
					<path d="M4 12 H36" fill="none" stroke="#3c342b" stroke-width="4" stroke-linecap="round" />
					<path d="M28 4 L40 12 L28 20" fill="none" stroke="#3c342b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
				<span class="mini glow bin-mini" data-testid="sort-example" aria-hidden="true">
					<BasketBin size={52} />
					<span class="in-bin">
						{#if SORTING_LEVELS[level].rule === 'size'}
							<SimplePic pic="apple" size={22} />
						{:else}
							<span class="chip" style="background:{FAMILY_SWATCH[sortColors()[1]]}"></span>
						{/if}
						<span class="wx-word">{basketLabel(1)}</span>
					</span>
				</span>
				<button
					class="odd-hear"
					type="button"
					data-testid="sort-hear"
					aria-label={SORT_PROMPT[language]}
					onclick={() => say(SORT_PROMPT[language])}
				>
					<svg viewBox="0 0 100 100" width="36" height="36" aria-hidden="true">
						<polygon points="18,38 42,38 64,18 64,82 42,62 18,62" fill="#3c342b" />
						<path d="M74 36 C84 44 84 56 74 64" fill="none" stroke="#3c342b" stroke-width="5" stroke-linecap="round" />
						<path d="M82 26 C98 40 98 60 82 74" fill="none" stroke="#3c342b" stroke-width="5" stroke-linecap="round" />
					</svg>
				</button>
			</div>
		{/if}
		{#if game === 'categories'}
			<div class="howto" data-testid="howto">
				<span class="mini" data-testid="category-pic-example" aria-hidden="true">
					<SimplePic pic="apple" size={44} />
					<svg class="tap" viewBox="0 0 48 48" width="28" height="28" aria-hidden="true">
						<ellipse cx="28" cy="38" rx="10" ry="6" fill="#f4c7a5" stroke="#3c342b" stroke-width="2" />
						<path
							d="M22 36 L22 16 C22 12 28 12 28 16 L28 22 L30 10 C30 7 34 7 34 11 L34 22 L36 14 C36 11 40 11 40 15 L40 28 C40 36 34 40 26 40 L22 36 Z"
							fill="#f4c7a5"
							stroke="#3c342b"
							stroke-width="2"
						/>
					</svg>
				</span>
				<svg class="path-arrow" viewBox="0 0 48 24" width="36" height="18" aria-hidden="true">
					<path d="M4 12 H36" fill="none" stroke="#3c342b" stroke-width="4" stroke-linecap="round" />
					<path d="M28 4 L40 12 L28 20" fill="none" stroke="#3c342b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
				<span class="mini glow bin-mini" data-testid="category-example" aria-hidden="true">
					<BasketBin size={52} />
					<span class="in-bin">
						<SimplePic pic="apple" size={22} />
						<span class="wx-word">{KIND_NAME.food[language]}</span>
					</span>
				</span>
				<button
					class="odd-hear"
					type="button"
					data-testid="category-hear"
					aria-label={CATEGORY_PROMPT[language]}
					onclick={() => say(CATEGORY_PROMPT[language])}
				>
					<svg viewBox="0 0 100 100" width="36" height="36" aria-hidden="true">
						<polygon points="18,38 42,38 64,18 64,82 42,62 18,62" fill="#3c342b" />
						<path d="M74 36 C84 44 84 56 74 64" fill="none" stroke="#3c342b" stroke-width="5" stroke-linecap="round" />
						<path d="M82 26 C98 40 98 60 82 74" fill="none" stroke="#3c342b" stroke-width="5" stroke-linecap="round" />
					</svg>
				</button>
			</div>
		{/if}
		<div class="row">
			{#each [0, 1] as bucket}
				<button
					class="basket cat"
					class:wait={selected !== null}
					class:glow={basketGlow(bucket)}
					data-bucket={bucket}
					data-drop="basket-{bucket}"
					aria-label={basketLabel(bucket)}
					onclick={() =>
						selected !== null
							? tapBucket(Number(selected), bucket as 0 | 1)
							: say(game === 'sorting' ? SORT_PROMPT[language] : CATEGORY_PROMPT[language])}
				>
					<BasketBin size={128} />
					<span class="in-bin">
						{#if game === 'sorting' && SORTING_LEVELS[level].rule === 'size'}
							<SimplePic pic="apple" size={bucket === 0 ? 44 : 22} />
						{:else if game === 'sorting'}
							<span class="chip" style="background:{FAMILY_SWATCH[sortColors()[bucket]]}"></span>
						{:else}
							<SimplePic pic={basketSample(bucket)} size={40} />
						{/if}
						<span class="wx-word">{basketLabel(bucket)}</span>
					</span>
					<span class="pile" aria-hidden="true">
						{#each sortItems as item, i}
							{#if sortPlaced[i] === bucket}
								<SimplePic pic={item.pic} size={item.size === 'small' ? 22 : 28} />
							{/if}
						{/each}
					</span>
				</button>
			{/each}
		</div>
		<div class="row">
			{#each sortItems as item, i}
				{#if sortPlaced[i] === null}
					<button
						class="choice"
						class:picked={selected === i}
						class:tiny={item.size === 'small'}
						data-bucket={item.bucket}
						data-pic={item.pic}
						aria-label={NAMES[item.pic][language]}
						onpointerdown={(event) => grab(event, { kind: 'sort', payload: i, pic: item.pic })}
						onpointermove={moveDrag}
						onpointerup={dropDrag}
						onpointercancel={() => (drag = null)}
						onclick={() => tapOrSkip(() => (selected = i))}
					>
						{#if item.color}
							<span class="mat" style="background:{FAMILY_SWATCH[item.color]}">
								<SimplePic pic={item.pic} size={64} />
							</span>
						{:else}
							<SimplePic pic={item.pic} size={item.size === 'small' ? 42 : 92} />
						{/if}
					</button>
				{/if}
			{/each}
		</div>
	{:else if game === 'next'}
		<div class="row">
			{#each row as pic}
				<SimplePic {pic} size={56} />
			{/each}
			<span class="gap">?</span>
		</div>
		<div class="row">
			{#each choices as pic}
				<button
					class="choice"
					class:glow={glowOn(NEXT_LEVELS[level].glow) && pic === gap}
					data-correct={pic === gap ? 'true' : undefined}
					data-pic={pic}
					aria-label={NAMES[pic][language]}
					onclick={() => tapChoice(pic)}
				>
					<SimplePic {pic} size={84} />
				</button>
			{/each}
		</div>
	{:else if game === 'path'}
		<div class="howto" data-testid="howto">
			<span class="mini" aria-hidden="true"><SimplePic pic="bird" size={44} /></span>
			<svg class="path-arrow" viewBox="0 0 48 24" width="36" height="18" aria-hidden="true">
				<path d="M4 12 H36" fill="none" stroke="#3c342b" stroke-width="4" stroke-linecap="round" />
				<path d="M28 4 L40 12 L28 20" fill="none" stroke="#3c342b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
			<span class="mini glow" data-testid="path-example" aria-hidden="true">
				<span class="step"></span>
				<svg class="tap" viewBox="0 0 48 48" width="28" height="28" aria-hidden="true">
					<ellipse cx="28" cy="38" rx="10" ry="6" fill="#f4c7a5" stroke="#3c342b" stroke-width="2" />
					<path
						d="M22 36 L22 16 C22 12 28 12 28 16 L28 22 L30 10 C30 7 34 7 34 11 L34 22 L36 14 C36 11 40 11 40 15 L40 28 C40 36 34 40 26 40 L22 36 Z"
						fill="#f4c7a5"
						stroke="#3c342b"
						stroke-width="2"
					/>
				</svg>
			</span>
			<svg class="path-arrow" viewBox="0 0 48 24" width="36" height="18" aria-hidden="true">
				<path d="M4 12 H36" fill="none" stroke="#3c342b" stroke-width="4" stroke-linecap="round" />
				<path d="M28 4 L40 12 L28 20" fill="none" stroke="#3c342b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
			<span class="mini" aria-hidden="true"><SimplePic pic="apple" size={44} /></span>
			<button
				class="odd-hear"
				type="button"
				data-testid="path-hear"
				aria-label={PATH_PROMPT[language]}
				onclick={() => say(PATH_PROMPT[language])}
			>
				<svg viewBox="0 0 100 100" width="36" height="36" aria-hidden="true">
					<polygon points="18,38 42,38 64,18 64,82 42,62 18,62" fill="#3c342b" />
					<path d="M74 36 C84 44 84 56 74 64" fill="none" stroke="#3c342b" stroke-width="5" stroke-linecap="round" />
					<path d="M82 26 C98 40 98 60 82 74" fill="none" stroke="#3c342b" stroke-width="5" stroke-linecap="round" />
				</svg>
			</button>
		</div>
		<div class="grid path" style="--cols:{pathCols};--rows:{pathRows}" data-testid="path-grid">
			{#each Array(pathCols * pathRows) as _, i}
				{#if path.includes(i) || i === decoy}
					<button
						class="square"
						class:on={path.indexOf(i) >= 0 && path.indexOf(i) <= pathStep}
						class:glow={PATH_LEVELS[level].glow && i === path[pathStep + 1]}
						class:goal={i === path[path.length - 1]}
						data-correct={i === path[pathStep + 1] ? 'true' : undefined}
						aria-label={i === path[path.length - 1] ? NAMES.apple[language] : i === path[pathStep] ? NAMES.bird[language] : 'square'}
						onclick={() => tapPath(i)}
					>
						{#if i === path[pathStep]}
							<SimplePic pic="bird" size={48} />
						{:else if i === path[path.length - 1]}
							<SimplePic pic="apple" size={44} />
						{/if}
					</button>
				{:else}
					<span class="path-hole" aria-hidden="true"></span>
				{/if}
			{/each}
		</div>
	{:else if game === 'jigsaw'}
		<div
			class="jigsaw-wrap"
			style="width:{JIGSAW_BOARD}px;height:{JIGSAW_BOARD}px;padding:{jigPad}px;--jig-pad:{jigPad}px"
		>
			{#if JIGSAW_LEVELS[level].ghost !== 'none'}
				<div class="ghost-whole" class:faint={JIGSAW_LEVELS[level].ghost === 'faint'}>
					<SimplePic pic={sample} size={JIGSAW_BOARD} />
				</div>
			{/if}
			<div class="grid jigsaw" style="--cols:{jig.cols};--rows:{jig.rows}">
				{#each chunkPlaced as fill, i}
					<button
						class="outline jig"
						class:filled={fill !== null}
						class:glow={JIGSAW_LEVELS[level].glow && selected === i}
						data-correct={selected !== null && Number(selected) === i ? 'true' : undefined}
						data-drop="jigsaw-{i}"
						aria-label="place {i + 1}"
						onclick={() => selected !== null && tapChunk(Number(selected), i)}
					>
						<span class="placed">
							<JigsawChunk
								pic={sample}
								index={fill ?? i}
								total={chunkPlaced.length}
								hollow={fill === null}
							/>
						</span>
					</button>
				{/each}
			</div>
		</div>
		<div class="row jig-tray">
			{#each chunks as chunk}
				{#if !chunkPlaced.includes(chunk)}
					<button
						class="choice jig"
						style="width:{jigSlotW + jigPad * 2}px;height:{jigSlotH + jigPad * 2}px"
						data-chunk={chunk}
						aria-label="chunk {chunk + 1}"
						onpointerdown={(event) => grab(event, { kind: 'jigsaw', payload: chunk, pic: sample })}
						onpointermove={moveDrag}
						onpointerup={dropDrag}
						onpointercancel={() => (drag = null)}
						onclick={() => tapOrSkip(() => (selected = chunk))}
					>
						<JigsawChunk pic={sample} index={chunk} total={chunkPlaced.length} />
					</button>
				{/if}
			{/each}
		</div>
	{:else if game === 'weather'}
		<div class="howto" data-testid="howto">
			<span class="mini wx-mini" aria-hidden="true">
				<WeatherScene weather="sun" size={96} />
			</span>
			<svg class="path-arrow" viewBox="0 0 48 24" width="36" height="18" aria-hidden="true">
				<path d="M4 12 H36" fill="none" stroke="#3c342b" stroke-width="4" stroke-linecap="round" />
				<path d="M28 4 L40 12 L28 20" fill="none" stroke="#3c342b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
			<span class="mini glow wx-chip-mini" data-testid="weather-example" aria-hidden="true">
				<WeatherIcon weather="sun" size={36} />
				<span class="wx-word">{WEATHER_NAME.sun[language]}</span>
				<svg class="tap" viewBox="0 0 48 48" width="28" height="28" aria-hidden="true">
					<ellipse cx="28" cy="38" rx="10" ry="6" fill="#f4c7a5" stroke="#3c342b" stroke-width="2" />
					<path
						d="M22 36 L22 16 C22 12 28 12 28 16 L28 22 L30 10 C30 7 34 7 34 11 L34 22 L36 14 C36 11 40 11 40 15 L40 28 C40 36 34 40 26 40 L22 36 Z"
						fill="#f4c7a5"
						stroke="#3c342b"
						stroke-width="2"
					/>
				</svg>
			</span>
			<button
				class="odd-hear"
				type="button"
				data-testid="weather-hear"
				aria-label={WEATHER_PROMPT[language]}
				onclick={() => say(WEATHER_PROMPT[language])}
			>
				<svg viewBox="0 0 100 100" width="36" height="36" aria-hidden="true">
					<polygon points="18,38 42,38 64,18 64,82 42,62 18,62" fill="#3c342b" />
					<path d="M74 36 C84 44 84 56 74 64" fill="none" stroke="#3c342b" stroke-width="5" stroke-linecap="round" />
					<path d="M82 26 C98 40 98 60 82 74" fill="none" stroke="#3c342b" stroke-width="5" stroke-linecap="round" />
				</svg>
			</button>
		</div>
		<div class="wx-scene" data-testid="weather-scene" data-weather={weatherTarget}>
			<WeatherScene weather={weatherTarget} size={280} />
		</div>
		<div class="row wrap">
			{#each weatherChoices as kind}
				<button
					class="choice wx"
					class:glow={glowOn(QUIZ_LEVELS[level].glow) && kind === weatherTarget}
					data-weather={kind}
					data-correct={kind === weatherTarget ? 'true' : undefined}
					aria-label={WEATHER_NAME[kind][language]}
					onclick={() => tapWeather(kind)}
				>
					<WeatherIcon weather={kind} size={52} />
					<span class="wx-word">{WEATHER_NAME[kind][language]}</span>
				</button>
			{/each}
		</div>
	{:else if game === 'odd-one-out'}
		<div class="howto" data-testid="howto">
			<span class="mini" aria-hidden="true"><SimplePic pic="apple" size={44} /></span>
			<span class="mini" aria-hidden="true"><SimplePic pic="apple" size={44} /></span>
			<span class="mini glow" data-testid="odd-example" aria-hidden="true">
				<SimplePic pic="car" size={44} />
				<svg class="tap" viewBox="0 0 48 48" width="28" height="28" aria-hidden="true">
					<ellipse cx="28" cy="38" rx="10" ry="6" fill="#f4c7a5" stroke="#3c342b" stroke-width="2" />
					<path
						d="M22 36 L22 16 C22 12 28 12 28 16 L28 22 L30 10 C30 7 34 7 34 11 L34 22 L36 14 C36 11 40 11 40 15 L40 28 C40 36 34 40 26 40 L22 36 Z"
						fill="#f4c7a5"
						stroke="#3c342b"
						stroke-width="2"
					/>
				</svg>
			</span>
			<button
				class="odd-hear"
				type="button"
				data-testid="odd-hear"
				aria-label={ODD_PROMPT[language]}
				onclick={() => say(ODD_PROMPT[language])}
			>
				<svg viewBox="0 0 100 100" width="36" height="36" aria-hidden="true">
					<polygon points="18,38 42,38 64,18 64,82 42,62 18,62" fill="#3c342b" />
					<path d="M74 36 C84 44 84 56 74 64" fill="none" stroke="#3c342b" stroke-width="5" stroke-linecap="round" />
					<path d="M82 26 C98 40 98 60 82 74" fill="none" stroke="#3c342b" stroke-width="5" stroke-linecap="round" />
				</svg>
			</button>
		</div>
		<div class="row">
			{#each oddPics as pic, i}
				<button
					class="choice"
					class:glow={glowOn(ODD_LEVELS[level].glow) && i === oddIndex}
					data-correct={i === oddIndex ? 'true' : undefined}
					aria-label={NAMES[pic][language]}
					onclick={() => tapOdd(i)}
				>
					<SimplePic {pic} size={84} />
				</button>
			{/each}
		</div>
	{/if}
</div>

{#if drag?.moved}
	<div class="lift" style="left:{drag.x}px;top:{drag.y}px">
		{#if drag.family}
			<span class="swatch" style="background:{FAMILY_SWATCH[drag.family]}"></span>
		{:else if drag.kind === 'jigsaw'}
			<JigsawChunk pic={sample} index={Number(drag.payload)} total={chunkPlaced.length} />
		{:else if drag.pic}
			<SimplePic pic={drag.pic} />
		{/if}
	</div>
{/if}

<style>
	.board {
		display: grid;
		gap: 16px;
		justify-items: center;
		padding: 18px 16px 28px;
		max-width: 680px;
		margin: 0 auto;
		background:
			radial-gradient(ellipse at 50% 0%, #ffe7b0 0 16%, transparent 48%),
			linear-gradient(#f8e2bc 0 42%, #d7e4a8 100%);
		border-radius: 40px;
		box-shadow:
			0 14px 0 #9fb56a,
			inset 0 0 0 6px rgba(255, 246, 234, 0.7);
	}
	.ask-q {
		font-size: 52px;
		font-weight: 800;
		line-height: 1;
	}
	.treats {
		display: flex;
		gap: 8px;
		justify-content: center;
	}
	.treat {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: #e4d3b0;
		box-shadow: inset 0 0 0 3px #fff6ea;
	}
	.treat.got {
		background: #ce2b37;
		box-shadow: 0 0 0 3px #fff, 0 0 8px #f0c14a;
	}
	.plate {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		justify-content: center;
		align-items: center;
		min-width: 132px;
		min-height: 108px;
		padding: 14px 18px;
		background: radial-gradient(circle at 50% 40%, #fffaf2, #f0d9b0 72%);
		border-radius: 50%;
		box-shadow:
			0 8px 0 #d2b48a,
			inset 0 0 0 5px #fff6ea;
	}
	.plus {
		font-size: 42px;
		font-weight: 800;
	}
	.row,
	.grid,
	.wrap {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		justify-content: center;
		align-items: center;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(4, 108px);
	}
	.grid.path {
		grid-template-columns: repeat(var(--cols), 76px);
		grid-template-rows: repeat(var(--rows), 76px);
		gap: 10px;
		justify-items: stretch;
		align-items: stretch;
	}
	.path .square {
		width: 76px;
		height: 76px;
		border-radius: 22px;
		background: linear-gradient(#e8d2a8, #d4b07a);
		box-shadow: 0 6px 0 #b08950;
	}
	.path .square.on {
		background: #8fbf73;
		box-shadow: 0 6px 0 #6ea85a;
	}
	.path .square.goal:not(.on) {
		background: linear-gradient(#fff8ea, #f3e0ba);
	}
	.path .square.glow {
		box-shadow:
			0 0 0 4px #fff,
			0 0 0 8px #f0c14a,
			0 6px 0 #b08950;
	}
	.path-hole {
		display: block;
	}
	.path-arrow {
		flex: 0 0 auto;
	}
	.step {
		width: 28px;
		height: 28px;
		border-radius: 10px;
		background: linear-gradient(#e8d2a8, #d4b07a);
		box-shadow: 0 3px 0 #b08950;
	}
	.grid.jigsaw {
		width: 100%;
		height: 100%;
		align-items: stretch;
		justify-items: stretch;
		grid-template-columns: repeat(var(--cols), 1fr);
		grid-template-rows: repeat(var(--rows), 1fr);
		gap: 0;
	}
	.jigsaw-wrap {
		position: relative;
		box-sizing: content-box;
		overflow: visible;
	}
	.ghost-whole {
		position: absolute;
		left: var(--jig-pad);
		top: var(--jig-pad);
		right: var(--jig-pad);
		bottom: var(--jig-pad);
		width: auto;
		height: auto;
		opacity: 0.35;
		pointer-events: none;
		z-index: 0;
		display: grid;
		place-items: center;
	}
	.ghost-whole.faint {
		opacity: 0.16;
	}
	.outline.jig,
	.choice.jig,
	button.outline.jig,
	button.choice.jig {
		width: 100%;
		height: 100%;
		min-width: 0;
		min-height: 0;
		padding: 0;
		overflow: visible;
		box-shadow: none;
		background: none;
		border-radius: 0;
		position: relative;
	}
	.outline.jig {
		z-index: 1;
	}
	.outline.jig.glow {
		z-index: 3;
	}
	.outline.jig.filled {
		z-index: 4;
	}
	.placed {
		position: absolute;
		left: calc(-1 * var(--jig-pad));
		top: calc(-1 * var(--jig-pad));
		pointer-events: none;
		z-index: 1;
	}
	.outline.jig.filled .placed {
		z-index: 2;
	}
	.jig-tray {
		gap: 16px;
		padding-top: 8px;
	}
	.jigsaw-wrap .grid.jigsaw {
		position: relative;
		z-index: 1;
	}
	button {
		font: inherit;
		border: 0;
		background: linear-gradient(#fff8ea, #f3e0ba);
		border-radius: 28px;
		cursor: pointer;
		transition: transform 0.12s ease;
	}
	button:active {
		transform: scale(0.94);
	}
	button:focus-visible {
		outline: 3px solid #2f6fed;
	}
	.choice,
	.card,
	.outline,
	.basket,
	.square {
		width: 108px;
		height: 108px;
		display: grid;
		place-items: center;
		box-shadow: 0 10px 0 #c9a66b, inset 0 3px 0 rgba(255, 255, 255, 0.7);
	}
	.card {
		background:
			radial-gradient(#f2c84b 14%, transparent 16%) 8px 8px / 20px 20px,
			linear-gradient(#d4a06a, #c48955);
	}
	.card.up {
		background: linear-gradient(#fffdf8, #fff6ea);
	}
	.swatch {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		box-shadow: 0 4px 0 rgba(0, 0, 0, 0.12);
		touch-action: none;
	}
	.choice {
		touch-action: none;
	}
	.lift {
		position: fixed;
		z-index: 40;
		pointer-events: none;
		transform: translate(-50%, -50%) scale(1.08);
		filter: drop-shadow(0 8px 10px rgba(60, 52, 43, 0.25));
	}
	.glow {
		box-shadow: 0 0 0 4px #fff, 0 0 0 8px #f0c14a;
	}
	.choice.num {
		font-weight: 800;
		font-size: 48px;
		line-height: 1;
		letter-spacing: -0.04em;
	}
	.digit {
		font-variant-numeric: tabular-nums;
	}
	.gap {
		font-size: 42px;
	}
	.square.on {
		background: #8fbf73;
	}
	.ghost {
		opacity: 0.35;
		display: grid;
		place-items: center;
	}
	.chip {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		box-shadow: 0 4px 0 rgba(0, 0, 0, 0.12);
	}
	.howto {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		flex-wrap: wrap;
		margin: 0 auto 22px;
		padding: 10px 14px;
		max-width: 420px;
		background: rgba(255, 250, 242, 0.78);
		border: 3px dashed #c9a66b;
		border-radius: 28px;
		pointer-events: none;
	}
	.mini {
		width: 56px;
		height: 56px;
		display: grid;
		place-items: center;
		position: relative;
		background: linear-gradient(#fff8ea, #f3e0ba);
		border-radius: 18px;
		box-shadow: 0 4px 0 #c9a66b;
	}
	.mini.glow {
		box-shadow: 0 0 0 4px #fff, 0 0 0 8px #f0c14a, 0 4px 0 #c9a66b;
	}
	.tap {
		position: absolute;
		right: -10px;
		bottom: -10px;
		filter: drop-shadow(0 2px 0 rgba(60, 52, 43, 0.2));
	}
	.odd-hear {
		pointer-events: auto;
		width: 56px;
		height: 56px;
		display: grid;
		place-items: center;
		padding: 0;
		border-radius: 18px;
		box-shadow: 0 4px 0 #c9a66b;
	}
	.wx-scene {
		display: grid;
		place-items: center;
		margin: 0 auto 18px;
	}
	.choice.wx {
		width: auto;
		min-width: 108px;
		height: auto;
		padding: 10px 14px 12px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.basket.cat {
		width: 140px;
		height: 128px;
		padding: 0;
		background: none;
		box-shadow: none;
		position: relative;
		overflow: visible;
	}
	.basket.cat.glow {
		box-shadow: 0 0 0 4px #fff, 0 0 0 8px #f0c14a;
	}
	.basket.cat.wait:not(.glow) {
		box-shadow: 0 0 0 3px #d7c4a0;
	}
	.basket.cat .in-bin,
	.bin-mini .in-bin {
		position: absolute;
		left: 0;
		right: 0;
		top: 6px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0;
		pointer-events: none;
	}
	.bin-mini {
		width: 72px;
		height: 64px;
		position: relative;
		background: none;
		box-shadow: none;
		padding: 0;
	}
	.bin-mini.glow {
		box-shadow: 0 0 0 4px #fff, 0 0 0 8px #f0c14a;
		border-radius: 18px;
	}
	.choice.picked {
		box-shadow: 0 0 0 4px #fff, 0 0 0 8px #6ea85a, 0 8px 0 #c9a66b;
	}
	.choice.tiny {
		width: 72px;
		height: 72px;
	}
	.mat {
		width: 88px;
		height: 88px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		box-shadow: inset 0 0 0 4px rgba(60, 52, 43, 0.15);
	}
	.pile {
		position: absolute;
		left: 12%;
		right: 12%;
		bottom: 6px;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0;
		pointer-events: none;
	}
	.basket.cat .wx-word,
	.bin-mini .wx-word {
		font-size: 15px;
		background: rgba(255, 250, 242, 0.92);
		padding: 0 6px;
		border-radius: 8px;
	}
	.wx-word {
		font-weight: 800;
		font-size: 18px;
		line-height: 1.1;
	}
	.mini.wx-mini {
		width: 96px;
		height: 68px;
		overflow: hidden;
	}
	.mini.wx-chip-mini {
		width: auto;
		min-width: 72px;
		height: auto;
		padding: 6px 10px 8px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>

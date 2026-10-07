import type { Level } from '../play/types.ts';
import { COLOR_FAMILIES, type ColorFamily as Color, type PicId } from '../play/pictures.ts';

export type QuizHelp = { pictures: number; glow: 'yes' | 'first' | 'no'; repeat: boolean; waitMs: number };

export const QUIZ_LEVELS: Record<Level, QuizHelp> = {
	1: { pictures: 2, glow: 'yes', repeat: true, waitMs: 2500 },
	2: { pictures: 2, glow: 'yes', repeat: true, waitMs: 2500 },
	3: { pictures: 2, glow: 'yes', repeat: true, waitMs: 2500 },
	4: { pictures: 3, glow: 'yes', repeat: true, waitMs: 2500 },
	5: { pictures: 3, glow: 'yes', repeat: true, waitMs: 4000 },
	6: { pictures: 3, glow: 'yes', repeat: false, waitMs: 0 },
	7: { pictures: 4, glow: 'yes', repeat: false, waitMs: 0 },
	8: { pictures: 4, glow: 'first', repeat: false, waitMs: 0 },
	9: { pictures: 4, glow: 'no', repeat: false, waitMs: 0 },
	10: { pictures: 4, glow: 'no', repeat: false, waitMs: 0 }
};

export const MEMORY_LEVELS: Record<Level, { pairs: number; previewMs: number; voice: boolean; pauseMs: number }> = {
	1: { pairs: 2, previewMs: 2500, voice: true, pauseMs: 900 },
	2: { pairs: 2, previewMs: 2500, voice: true, pauseMs: 900 },
	3: { pairs: 3, previewMs: 1800, voice: true, pauseMs: 600 },
	4: { pairs: 3, previewMs: 1800, voice: true, pauseMs: 400 },
	5: { pairs: 4, previewMs: 1200, voice: true, pauseMs: 400 },
	6: { pairs: 4, previewMs: 1200, voice: false, pauseMs: 400 },
	7: { pairs: 5, previewMs: 700, voice: false, pauseMs: 250 },
	8: { pairs: 5, previewMs: 0, voice: false, pauseMs: 250 },
	9: { pairs: 6, previewMs: 0, voice: false, pauseMs: 0 },
	10: { pairs: 6, previewMs: 0, voice: false, pauseMs: 0 }
};

export const MEMORY_EXTRAS: PicId[] = ['apple', 'ball'];

export const PAINT_LEVELS: Record<
	Level,
	{ regions: number; palette: 'right' | 'used' | 'used+1' | 'all'; voice: boolean; glow: boolean; friend: PicId }
> = {
	1: { regions: 1, palette: 'right', voice: true, glow: false, friend: 'bird' },
	2: { regions: 2, palette: 'used', voice: true, glow: false, friend: 'cat' },
	3: { regions: 3, palette: 'used+1', voice: true, glow: true, friend: 'dog' },
	4: { regions: 3, palette: 'all', voice: true, glow: true, friend: 'rabbit' },
	5: { regions: 4, palette: 'all', voice: true, glow: true, friend: 'bird' },
	6: { regions: 5, palette: 'all', voice: false, glow: true, friend: 'cat' },
	7: { regions: 6, palette: 'all', voice: false, glow: true, friend: 'dog' },
	8: { regions: 7, palette: 'all', voice: false, glow: true, friend: 'rabbit' },
	9: { regions: 7, palette: 'all', voice: false, glow: true, friend: 'bird' },
	10: { regions: 8, palette: 'all', voice: false, glow: false, friend: 'cat' }
};

export const PAINT_REGIONS: Record<Level, Color[]> = {
	1: ['yellow'],
	2: ['orange', 'white'],
	3: ['brown', 'white', 'black'],
	4: ['brown', 'white', 'white'],
	5: ['yellow', 'white', 'orange', 'black'],
	6: ['orange', 'white', 'black', 'white', 'black'],
	7: ['brown', 'white', 'black', 'brown', 'black', 'red'],
	8: ['brown', 'white', 'white', 'brown', 'black', 'black', 'blue'],
	9: ['yellow', 'white', 'orange', 'black', 'green', 'yellow', 'orange'],
	10: ['orange', 'white', 'black', 'white', 'black', 'blue', 'red', 'black']
};

export const COUNT_LEVELS: Record<
	Level,
	{ max: number; min: number; answers: number; countAlong: boolean; glow: 'yes' | 'first' | 'no' }
> = {
	1: { min: 1, max: 2, answers: 2, countAlong: true, glow: 'yes' },
	2: { min: 1, max: 2, answers: 2, countAlong: true, glow: 'yes' },
	3: { min: 1, max: 3, answers: 2, countAlong: true, glow: 'yes' },
	4: { min: 1, max: 3, answers: 3, countAlong: true, glow: 'yes' },
	5: { min: 1, max: 4, answers: 3, countAlong: true, glow: 'yes' },
	6: { min: 1, max: 4, answers: 3, countAlong: true, glow: 'yes' },
	7: { min: 1, max: 5, answers: 4, countAlong: false, glow: 'yes' },
	8: { min: 1, max: 5, answers: 4, countAlong: false, glow: 'first' },
	9: { min: 1, max: 5, answers: 4, countAlong: false, glow: 'no' },
	10: { min: 1, max: 5, answers: 4, countAlong: false, glow: 'no' }
};

export const MATH_LEVELS: Record<
	Level,
	{ minTotal: number; maxTotal: number; answers: number; countAlong: boolean; glow: 'yes' | 'first' | 'no' }
> = {
	1: { minTotal: 2, maxTotal: 2, answers: 2, countAlong: true, glow: 'yes' },
	2: { minTotal: 2, maxTotal: 3, answers: 2, countAlong: true, glow: 'yes' },
	3: { minTotal: 2, maxTotal: 3, answers: 2, countAlong: true, glow: 'yes' },
	4: { minTotal: 2, maxTotal: 4, answers: 3, countAlong: true, glow: 'yes' },
	5: { minTotal: 2, maxTotal: 4, answers: 3, countAlong: true, glow: 'yes' },
	6: { minTotal: 2, maxTotal: 4, answers: 3, countAlong: true, glow: 'yes' },
	7: { minTotal: 2, maxTotal: 5, answers: 4, countAlong: false, glow: 'yes' },
	8: { minTotal: 2, maxTotal: 5, answers: 4, countAlong: false, glow: 'first' },
	9: { minTotal: 2, maxTotal: 5, answers: 4, countAlong: false, glow: 'no' },
	10: { minTotal: 2, maxTotal: 5, answers: 4, countAlong: false, glow: 'no' }
};

export const PHRASE_LEVELS: Record<Level, { pictures: number; both: boolean; glow: 'yes' | 'first' | 'no'; repeat: boolean; waitMs: number }> =
	{
		1: { pictures: 2, both: false, glow: 'yes', repeat: true, waitMs: 2500 },
		2: { pictures: 2, both: false, glow: 'yes', repeat: true, waitMs: 2500 },
		3: { pictures: 2, both: false, glow: 'yes', repeat: true, waitMs: 2500 },
		4: { pictures: 3, both: false, glow: 'yes', repeat: true, waitMs: 2500 },
		5: { pictures: 3, both: false, glow: 'yes', repeat: true, waitMs: 4000 },
		6: { pictures: 3, both: true, glow: 'yes', repeat: false, waitMs: 0 },
		7: { pictures: 4, both: true, glow: 'yes', repeat: false, waitMs: 0 },
		8: { pictures: 4, both: true, glow: 'first', repeat: false, waitMs: 0 },
		9: { pictures: 4, both: true, glow: 'no', repeat: false, waitMs: 0 },
		10: { pictures: 4, both: true, glow: 'no', repeat: false, waitMs: 0 }
	};

export const STICKERS_LEVELS: Record<Level, { count: number; voice: boolean; glow: boolean }> = {
	1: { count: 1, voice: true, glow: false },
	2: { count: 2, voice: true, glow: false },
	3: { count: 3, voice: true, glow: true },
	4: { count: 3, voice: true, glow: true },
	5: { count: 4, voice: true, glow: true },
	6: { count: 5, voice: false, glow: true },
	7: { count: 6, voice: false, glow: true },
	8: { count: 7, voice: false, glow: true },
	9: { count: 7, voice: false, glow: true },
	10: { count: 8, voice: false, glow: false }
};

export const SORTING_LEVELS: Record<
	Level,
	{
		rule: 'size' | 'color';
		pictures: number;
		voice: boolean;
		glow: boolean;
		colors?: [Color, Color];
	}
> = {
	1: { rule: 'size', pictures: 4, voice: true, glow: true },
	2: { rule: 'size', pictures: 4, voice: true, glow: false },
	3: { rule: 'size', pictures: 5, voice: true, glow: false },
	4: { rule: 'size', pictures: 6, voice: false, glow: false },
	5: { rule: 'size', pictures: 6, voice: false, glow: false },
	6: { rule: 'color', pictures: 4, voice: true, glow: true, colors: ['red', 'yellow'] },
	7: { rule: 'color', pictures: 5, voice: false, glow: false, colors: ['red', 'yellow'] },
	8: { rule: 'color', pictures: 6, voice: false, glow: false, colors: ['red', 'blue'] },
	9: { rule: 'color', pictures: 6, voice: false, glow: false, colors: ['red', 'blue'] },
	10: { rule: 'color', pictures: 6, voice: false, glow: false, colors: ['green', 'blue'] }
};

export const CATEGORY_LEVELS: Record<Level, { kinds: [string, string]; pictures: number; voice: boolean; glow: boolean }> = {
	1: { kinds: ['food', 'vehicles'], pictures: 2, voice: true, glow: true },
	2: { kinds: ['food', 'vehicles'], pictures: 2, voice: true, glow: false },
	3: { kinds: ['friends', 'clothes'], pictures: 3, voice: true, glow: false },
	4: { kinds: ['friends', 'clothes'], pictures: 3, voice: true, glow: false },
	5: { kinds: ['food', 'vehicles'], pictures: 4, voice: true, glow: false },
	6: { kinds: ['toys', 'instruments'], pictures: 4, voice: true, glow: false },
	7: { kinds: ['toys', 'instruments'], pictures: 5, voice: false, glow: false },
	8: { kinds: ['food', 'toys'], pictures: 5, voice: false, glow: false },
	9: { kinds: ['food', 'toys'], pictures: 6, voice: false, glow: false },
	10: { kinds: ['clothes', 'toys'], pictures: 6, voice: false, glow: false }
};

export const SPEED_LEVELS: Record<Level, { choices: number; glow: 'yes' | 'first' | 'no'; closeness: 'far' | 'mixed' | 'closer' | 'close' }> =
	{
		1: { choices: 2, glow: 'yes', closeness: 'far' },
		2: { choices: 2, glow: 'yes', closeness: 'far' },
		3: { choices: 2, glow: 'yes', closeness: 'far' },
		4: { choices: 3, glow: 'yes', closeness: 'mixed' },
		5: { choices: 3, glow: 'yes', closeness: 'mixed' },
		6: { choices: 3, glow: 'yes', closeness: 'closer' },
		7: { choices: 4, glow: 'yes', closeness: 'closer' },
		8: { choices: 4, glow: 'first', closeness: 'closer' },
		9: { choices: 4, glow: 'no', closeness: 'close' },
		10: { choices: 4, glow: 'no', closeness: 'close' }
	};

export const SHADOW_LEVELS: Record<
	Level,
	{ choices: number; glow: 'yes' | 'first' | 'no'; closeness: 'far' | 'mixed' | 'closer' | 'close' }
> = {
	1: { ...SPEED_LEVELS[1], glow: 'yes' },
	2: { ...SPEED_LEVELS[2], glow: 'no' },
	3: { ...SPEED_LEVELS[3], glow: 'no' },
	4: { ...SPEED_LEVELS[4], glow: 'no' },
	5: { ...SPEED_LEVELS[5], glow: 'no' },
	6: { ...SPEED_LEVELS[6], glow: 'no' },
	7: { ...SPEED_LEVELS[7], glow: 'no' },
	8: { ...SPEED_LEVELS[8], glow: 'no' },
	9: { ...SPEED_LEVELS[9], glow: 'no' },
	10: { ...SPEED_LEVELS[10], glow: 'no' }
};

export const NEXT_LEVELS: Record<
	Level,
	{ pattern: 'AB' | 'ABC'; shown: number; choices: number; voice: boolean; glow: 'yes' | 'first' | 'no' }
> = {
	1: { pattern: 'AB', shown: 3, choices: 2, voice: true, glow: 'yes' },
	2: { pattern: 'AB', shown: 3, choices: 2, voice: true, glow: 'yes' },
	3: { pattern: 'AB', shown: 3, choices: 2, voice: true, glow: 'yes' },
	4: { pattern: 'AB', shown: 5, choices: 3, voice: true, glow: 'yes' },
	5: { pattern: 'AB', shown: 5, choices: 3, voice: true, glow: 'yes' },
	6: { pattern: 'ABC', shown: 5, choices: 3, voice: true, glow: 'yes' },
	7: { pattern: 'ABC', shown: 5, choices: 4, voice: false, glow: 'yes' },
	8: { pattern: 'ABC', shown: 7, choices: 4, voice: false, glow: 'first' },
	9: { pattern: 'ABC', shown: 7, choices: 4, voice: false, glow: 'no' },
	10: { pattern: 'ABC', shown: 7, choices: 4, voice: false, glow: 'no' }
};

export const PATH_LEVELS: Record<
	Level,
	{ taps: number; shape: 'straight' | 'one-bend' | 'two-bends'; decoy: boolean; voice: boolean; glow: boolean }
> = {
	1: { taps: 1, shape: 'straight', decoy: false, voice: true, glow: true },
	2: { taps: 2, shape: 'straight', decoy: false, voice: true, glow: true },
	3: { taps: 2, shape: 'straight', decoy: false, voice: true, glow: true },
	4: { taps: 3, shape: 'straight', decoy: false, voice: true, glow: true },
	5: { taps: 3, shape: 'one-bend', decoy: false, voice: true, glow: true },
	6: { taps: 4, shape: 'one-bend', decoy: false, voice: false, glow: true },
	7: { taps: 4, shape: 'one-bend', decoy: false, voice: false, glow: true },
	8: { taps: 5, shape: 'two-bends', decoy: false, voice: false, glow: true },
	9: { taps: 5, shape: 'two-bends', decoy: true, voice: false, glow: false },
	10: { taps: 6, shape: 'two-bends', decoy: true, voice: false, glow: false }
};

export const JIGSAW_LEVELS: Record<Level, { chunks: number; ghost: 'full' | 'faint' | 'none'; voice: boolean; glow: boolean }> = {
	1: { chunks: 2, ghost: 'full', voice: true, glow: true },
	2: { chunks: 2, ghost: 'full', voice: true, glow: true },
	3: { chunks: 3, ghost: 'full', voice: true, glow: true },
	4: { chunks: 3, ghost: 'full', voice: true, glow: true },
	5: { chunks: 4, ghost: 'full', voice: true, glow: true },
	6: { chunks: 4, ghost: 'faint', voice: false, glow: true },
	7: { chunks: 5, ghost: 'faint', voice: false, glow: true },
	8: { chunks: 5, ghost: 'faint', voice: false, glow: true },
	9: { chunks: 6, ghost: 'none', voice: false, glow: false },
	10: { chunks: 6, ghost: 'none', voice: false, glow: false }
};

export const ODD_LEVELS: Record<Level, { pictures: number; kinds: [string, string]; glow: 'yes' | 'first' | 'no' }> = {
	1: { pictures: 3, kinds: ['food', 'vehicles'], glow: 'yes' },
	2: { pictures: 3, kinds: ['food', 'vehicles'], glow: 'yes' },
	3: { pictures: 3, kinds: ['friends', 'clothes'], glow: 'yes' },
	4: { pictures: 3, kinds: ['friends', 'clothes'], glow: 'yes' },
	5: { pictures: 3, kinds: ['food', 'vehicles'], glow: 'yes' },
	6: { pictures: 4, kinds: ['toys', 'instruments'], glow: 'yes' },
	7: { pictures: 4, kinds: ['toys', 'instruments'], glow: 'yes' },
	8: { pictures: 4, kinds: ['food', 'toys'], glow: 'first' },
	9: { pictures: 4, kinds: ['food', 'toys'], glow: 'no' },
	10: { pictures: 4, kinds: ['clothes', 'toys'], glow: 'no' }
};

export const SAFARI_POOLS: Record<Level, PicId[]> = {
	1: ['bird', 'cat', 'dog'],
	2: ['bird', 'cat', 'dog'],
	3: ['bird', 'cat', 'dog'],
	4: ['bird', 'cat', 'dog'],
	5: ['bird', 'cat', 'dog'],
	6: ['bird', 'cat', 'dog', 'car', 'train'],
	7: ['bird', 'cat', 'dog', 'car', 'train', 'drum', 'piano'],
	8: ['bird', 'cat', 'dog', 'car', 'train', 'drum', 'piano'],
	9: ['bird', 'cat', 'dog', 'car', 'train', 'drum', 'piano'],
	10: ['bird', 'cat', 'dog', 'car', 'train', 'drum', 'piano']
};

export function paintPalette(level: Level): Color[] {
	const used = [...new Set(PAINT_REGIONS[level])];
	if (PAINT_LEVELS[level].palette === 'right') return [used[0]!];
	if (PAINT_LEVELS[level].palette === 'used') return used;
	if (PAINT_LEVELS[level].palette === 'used+1') {
		const extra = COLOR_FAMILIES.find((family) => !used.includes(family));
		return extra ? [...used, extra] : used;
	}
	return [...COLOR_FAMILIES];
}

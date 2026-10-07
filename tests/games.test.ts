import { describe, expect, test } from 'vitest';
import {
	CATEGORY_LEVELS,
	COUNT_LEVELS,
	JIGSAW_LEVELS,
	MATH_LEVELS,
	MEMORY_LEVELS,
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
} from '../src/lib/games/tables.ts';

describe('catalog tables', () => {
	test('Paint levels 1 and 10 match the spec', () => {
		expect(PAINT_LEVELS[1]).toMatchObject({ regions: 1, palette: 'right', voice: true, glow: false });
		expect(PAINT_LEVELS[10]).toMatchObject({ regions: 8, palette: 'all', voice: false, glow: false });
		expect(PAINT_REGIONS[1]).toHaveLength(1);
		expect(PAINT_REGIONS[10]).toHaveLength(8);
		expect(paintPalette(1)).toEqual(['yellow']);
		expect(paintPalette(10)).toHaveLength(9);
	});

	test('Memory, quizzes, count, and the rest lock levels 1 and 10', () => {
		expect(MEMORY_LEVELS[1].pairs).toBe(2);
		expect(MEMORY_LEVELS[10]).toMatchObject({ pairs: 6, previewMs: 0 });
		expect(QUIZ_LEVELS[1].pictures).toBe(2);
		expect(QUIZ_LEVELS[10]).toMatchObject({ pictures: 4, glow: 'no', repeat: false });
		expect(COUNT_LEVELS[1]).toMatchObject({ min: 1, max: 2, answers: 2, countAlong: true });
		expect(COUNT_LEVELS[10]).toMatchObject({ max: 5, answers: 4, countAlong: false, glow: 'no' });
		expect(MATH_LEVELS[1].minTotal).toBe(2);
		expect(MATH_LEVELS[10].maxTotal).toBe(5);
		expect(PHRASE_LEVELS[1].both).toBe(false);
		expect(PHRASE_LEVELS[10].both).toBe(true);
		expect(STICKERS_LEVELS[1].count).toBe(1);
		expect(STICKERS_LEVELS[10].count).toBe(8);
		expect(SORTING_LEVELS[1].rule).toBe('size');
		expect(SORTING_LEVELS[1].pictures).toBe(4);
		expect(SORTING_LEVELS[1].glow).toBe(true);
		expect(SORTING_LEVELS[2].glow).toBe(false);
		expect(SORTING_LEVELS[10].rule).toBe('color');
		expect(SORTING_LEVELS[10].pictures).toBe(6);
		expect(CATEGORY_LEVELS[1].kinds).toEqual(['food', 'vehicles']);
		expect(CATEGORY_LEVELS[1].glow).toBe(true);
		expect(CATEGORY_LEVELS[2].glow).toBe(false);
		expect(CATEGORY_LEVELS[10].kinds).toEqual(['clothes', 'toys']);
		expect(CATEGORY_LEVELS[10].glow).toBe(false);
		expect(SPEED_LEVELS[1].choices).toBe(2);
		expect(SPEED_LEVELS[10].glow).toBe('no');
		expect(SHADOW_LEVELS[1].glow).toBe('yes');
		expect(SHADOW_LEVELS[2].glow).toBe('no');
		expect(SHADOW_LEVELS[10].glow).toBe('no');
		expect(NEXT_LEVELS[1].pattern).toBe('AB');
		expect(NEXT_LEVELS[10].pattern).toBe('ABC');
		expect(PATH_LEVELS[1].taps).toBe(1);
		expect(PATH_LEVELS[10].taps).toBe(6);
		expect(JIGSAW_LEVELS[1].chunks).toBe(2);
		expect(JIGSAW_LEVELS[10].chunks).toBe(6);
		expect(ODD_LEVELS[1].pictures).toBe(3);
		expect(ODD_LEVELS[10].pictures).toBe(4);
		expect(SAFARI_POOLS[1]).toEqual(['bird', 'cat', 'dog']);
		expect(SAFARI_POOLS[1]).not.toContain('rabbit');
		expect(SAFARI_POOLS[10]).toContain('piano');
	});
});

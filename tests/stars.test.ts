import { describe, expect, test } from 'vitest';
import { cheerKind, litStarCount, rowComplete, starsForHome } from '../src/lib/play/stars.ts';
import type { PlayRecord } from '../src/lib/play/types.ts';

const records: PlayRecord[] = [
	{ slotId: 'a', game: 'paint', level: 1, timeMs: 9000, date: '2026-10-05' },
	{ slotId: 'a', game: 'paint', level: 1, timeMs: 4000, date: '2026-10-05' },
	{ slotId: 'a', game: 'paint', level: 2, timeMs: 8000, date: '2026-10-05' }
];

describe('stars', () => {
	test('Home stars count first finishes, not replays', () => {
		expect(litStarCount(records, 'paint')).toBe(2);
		expect(litStarCount(records, 'memory')).toBe(0);
		expect(starsForHome(records, 'paint')).toEqual([
			true,
			true,
			false,
			false,
			false,
			false,
			false,
			false,
			false,
			false
		]);
		expect(rowComplete(starsForHome(records, 'paint'))).toBe(false);
		expect(cheerKind(true, starsForHome(records, 'paint'))).toBe('star');
		expect(cheerKind(false, starsForHome(records, 'paint'))).toBeNull();
		expect(rowComplete(Array(10).fill(true))).toBe(true);
		expect(cheerKind(true, Array(10).fill(true))).toBe('all');
	});
});

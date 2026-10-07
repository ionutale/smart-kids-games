import { describe, expect, test } from 'vitest';
import { bestTimeMs, finishOutcome, nextUnfinishedLevel } from '../src/lib/play/runtime.ts';
import type { PlayRecord } from '../src/lib/play/types.ts';

const records: PlayRecord[] = [
	{ slotId: 'a', game: 'memory', level: 1, timeMs: 5000, date: '2026-10-05' },
	{ slotId: 'a', game: 'memory', level: 1, timeMs: 8000, date: '2026-10-05' }
];

describe('play runtime', () => {
	test('opens the next unfinished level and treats the shortest record as best time', () => {
		expect(nextUnfinishedLevel(records, 'memory')).toBe(2);
		expect(nextUnfinishedLevel([], 'paint')).toBe(1);
		expect(bestTimeMs(records, 'memory', 1)).toBe(5000);
		expect(finishOutcome(records, 'memory', 1, 4000)).toEqual({ firstFinish: false, faster: true });
		expect(finishOutcome(records, 'memory', 1, 9000)).toEqual({ firstFinish: false, faster: false });
		expect(finishOutcome(records, 'memory', 2, 9000)).toEqual({ firstFinish: true, faster: false });
	});
});

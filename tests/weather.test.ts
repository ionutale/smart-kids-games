import { describe, expect, test } from 'vitest';
import { QUIZ_LEVELS } from '../src/lib/games/tables.ts';
import { WEATHER_IDS, WEATHER_POOLS } from '../src/lib/play/weather.ts';

describe('weather pools', () => {
	test('each level has enough kinds for the quiz picture count', () => {
		for (const level of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const) {
			expect(WEATHER_POOLS[level].length).toBeGreaterThanOrEqual(QUIZ_LEVELS[level].pictures);
			for (const kind of WEATHER_POOLS[level]) {
				expect(WEATHER_IDS).toContain(kind);
			}
		}
	});
});

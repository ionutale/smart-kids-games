import { describe, expect, test } from 'vitest';
import { SAFARI_POOLS } from '../src/lib/games/tables.ts';
import { SAFARI_SFX } from '../src/lib/play/sfx.ts';

describe('sound safari clips', () => {
	test('every pool picture has its own clip', () => {
		const pics = new Set(Object.values(SAFARI_POOLS).flat());
		for (const pic of pics) {
			expect(SAFARI_SFX[pic]).toMatch(new RegExp(`/sfx/safari/${pic}\\.wav`));
		}
	});
});

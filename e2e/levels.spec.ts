import { expect, test } from '@playwright/test';
import { GAME_IDS, playThrough, startPlaying } from './helpers.ts';

test.describe('every level', () => {
	test.describe.configure({ timeout: 180_000 });

	for (const game of GAME_IDS) {
		test(`${game} finishes levels 1 through 10 and lights every star`, async ({ page }) => {
			await startPlaying(page);
			await playThrough(page, game);
			await expect(page.getByTestId('cheer')).toHaveAttribute('data-cheer', 'all');
			await page.goto('/');
			await expect(page.getByTestId(`cottage-${game}`).locator('.star.on')).toHaveCount(10);
			await expect(page.getByTestId(`cottage-${game}`)).toHaveAttribute('data-complete', '1');
		});
	}
});

import { expect, test } from '@playwright/test';
import { completeCurrentLevel, GAME_IDS, playLevelOne, startPlaying, type GameId } from './helpers.ts';

test.describe('games', () => {
	for (const game of GAME_IDS) {
		test(`completes ${game} level 1, lights a star, and can replay`, async ({ page }) => {
			await startPlaying(page);
			await playLevelOne(page, game);
			await expect(page).toHaveURL(new RegExp(`/play/${game}.*star=1`));
			await expect(page.getByTestId('cheer')).toHaveAttribute('data-cheer', 'star');
			await expect(page.getByTestId('play')).toHaveAttribute('data-cheer', 'star');
			await page.goto('/');
			await expect(page.getByTestId(`cottage-${game}`).locator('.star.on').first()).toBeVisible();
			await expect(page.getByTestId(`cottage-${game}`)).toHaveAttribute('data-complete', '0');
			await page.goto(`/play/${game}?level=1`);
			await expect(page.getByTestId('play')).toHaveAttribute('data-level', '1');
			await completeCurrentLevel(page);
			await expect(page.getByTestId('play')).toHaveAttribute('data-level', '2');
			await expect(page).toHaveURL(/faster=1/);
			await expect(page.locator('.star.wiggle')).toBeVisible();
		});
	}

	test('the friend asks, and count apples sit on a plate', async ({ page }) => {
		await startPlaying(page);
		await page.goto('/play/animals');
		await expect(page.getByTestId('buddy')).toBeVisible();
		await expect(page.getByTestId('buddy-hear')).toBeVisible();
		await expect(page.getByTestId('treats')).toBeVisible();
		await page.goto('/play/count');
		await expect(page.getByTestId('buddy')).toBeVisible();
		await expect(page.getByTestId('plate')).toBeVisible();
		await expect(page.locator('[data-testid="plate"] svg').first()).toBeVisible();
		await page.goto('/play/speed');
		await expect(page.getByTestId('buddy-ask')).toBeVisible();
	});

	test('paint level 1 can finish by dragging a color onto the region', async ({ page }) => {
		await startPlaying(page);
		await page.goto('/play/paint');
		await expect(page.getByTestId('board')).toBeVisible();
		await page.waitForTimeout(800);
		await page.locator('button.swatch').first().dragTo(page.getByTestId('region-1'));
		await expect(page.getByTestId('play')).toHaveAttribute('data-level', '2');
		await expect(page).toHaveURL(/star=1/);
	});

	test('stickers level 1 can finish by dragging a picture onto its outline', async ({ page }) => {
		await startPlaying(page);
		await page.goto('/play/stickers');
		await expect(page.getByTestId('board')).toBeVisible();
		await page.waitForTimeout(800);
		const outline = page.locator('.outline').first();
		const pic = await outline.getAttribute('data-pic');
		await page.locator(`button.choice[data-pic="${pic}"]`).dragTo(outline);
		await expect(page.getByTestId('play')).toHaveAttribute('data-level', '2');
	});

	test('paint free style does not record a star', async ({ page }) => {
		await startPlaying(page);
		await page.goto('/play/paint?free=1');
		await expect(page.getByTestId('free-style')).toBeVisible();
		const regions = page.locator('[data-testid^="region-"]');
		const swatches = page.locator('button.swatch');
		const n = await regions.count();
		for (let i = 0; i < n; i++) {
			await regions.nth(i).click({ force: true });
			await swatches.first().click();
		}
		await expect(page).toHaveURL(/free=1/);
		await expect(page.getByTestId('play')).toHaveAttribute('data-level', '1');
		await page.goto('/');
		await expect(page.getByTestId('cottage-paint').locator('.star.on')).toHaveCount(0);
	});

	test('play without a picture slot returns home', async ({ page }) => {
		await page.goto('/play/paint');
		await expect(page).toHaveURL('/');
	});

	test('unknown game returns home', async ({ page }) => {
		await page.goto('/play/blippi');
		await expect(page).toHaveURL('/');
	});

	test('ships original sfx and a hear-again control on sound safari', async ({ page, request }) => {
		const files = [
			'tap.wav',
			'success.wav',
			'miss.wav',
			'home-loop.wav',
			'safari/bird.wav',
			'safari/cat.wav',
			'safari/dog.wav',
			'safari/car.wav',
			'safari/train.wav',
			'safari/drum.wav',
			'safari/piano.wav'
		];
		for (const file of files) {
			const res = await request.get(`/sfx/${file}`);
			expect(res.ok()).toBeTruthy();
			expect((await res.body()).byteLength).toBeGreaterThan(200);
		}
		await startPlaying(page);
		await page.goto('/play/sound-safari');
		await expect(page.getByTestId('hear')).toBeVisible();
	});

	test('odd one out shows two same, one different, and a hear-again question', async ({ page }) => {
		await startPlaying(page);
		await page.goto('/play/odd-one-out');
		await expect(page.getByTestId('play')).toHaveAttribute('data-game', 'odd-one-out');
		await expect(page.getByTestId('howto')).toBeVisible();
		await expect(page.getByTestId('odd-example')).toBeVisible();
		await expect(page.getByTestId('odd-hear')).toHaveAttribute('aria-label', /different|diverso/i);
		await expect(page.locator('[data-testid="board"] button.choice')).toHaveCount(3);
		await page.getByTestId('odd-hear').click();
		await expect(page.getByTestId('howto')).toBeVisible();
		await expect(page.locator('[data-testid="board"] button.choice')).toHaveCount(3);
	});

	test('sorting mixes different pictures by size into real bins', async ({ page }) => {
		await startPlaying(page);
		await page.goto('/play/sorting');
		await expect(page.getByTestId('play')).toHaveAttribute('data-game', 'sorting');
		await expect(page.getByTestId('howto')).toBeVisible();
		await expect(page.getByTestId('sort-example')).toBeVisible();
		await expect(page.locator('[data-testid="board"] button.basket.cat')).toHaveCount(2);
		const items = page.locator('[data-testid="board"] button.choice');
		await expect(items).toHaveCount(4);
		const pics = await items.evaluateAll((els) => els.map((el) => el.getAttribute('data-pic')));
		expect(new Set(pics).size).toBe(4);
		await expect(page.locator('[data-testid="board"] button.choice.tiny')).toHaveCount(2);
		await page.getByTestId('sort-hear').click();
		await expect(page.locator('[data-testid="board"] button.choice')).toHaveCount(4);
	});

	test('count answers are real numerals', async ({ page }) => {
		await startPlaying(page);
		await page.goto('/play/count');
		await expect(page.getByTestId('play')).toHaveAttribute('data-game', 'count');
		const choices = page.locator('[data-testid="board"] button.choice.num');
		await expect(choices).toHaveCount(2);
		const labels = await choices.allTextContents();
		expect(labels.every((text) => /^[1-5]$/.test(text.trim()))).toBe(true);
		await expect(page.locator('[data-testid="board"] button.choice.num i')).toHaveCount(0);
	});

	test('math answers are real numerals', async ({ page }) => {
		await startPlaying(page);
		await page.goto('/play/math');
		await expect(page.getByTestId('play')).toHaveAttribute('data-game', 'math');
		const choices = page.locator('[data-testid="board"] button.choice.num');
		await expect(choices.first()).toBeVisible();
		const labels = await choices.allTextContents();
		expect(labels.length).toBeGreaterThan(0);
		expect(labels.every((text) => /^[1-5]$/.test(text.trim()))).toBe(true);
		await expect(page.locator('[data-testid="board"] button.choice.num i')).toHaveCount(0);
	});

	test('categories shows labeled baskets and how to sort', async ({ page }) => {
		await startPlaying(page);
		await page.goto('/play/categories');
		await expect(page.getByTestId('play')).toHaveAttribute('data-game', 'categories');
		await expect(page.getByTestId('howto')).toBeVisible();
		await expect(page.getByTestId('category-example')).toBeVisible();
		await expect(page.getByTestId('category-pic-example')).toBeVisible();
		await expect(page.getByTestId('category-hear')).toHaveAttribute('aria-label', /picture|immagine/i);
		await expect(page.locator('[data-testid="board"] button.basket.cat')).toHaveCount(2);
		await expect(page.getByRole('button', { name: /food|cibo/i })).toBeVisible();
		await expect(page.getByRole('button', { name: /vehicles|mezzi/i })).toBeVisible();
		await expect(page.locator('[data-testid="board"] button.choice')).toHaveCount(2);
		await page.getByTestId('category-hear').click();
		await expect(page.getByTestId('howto')).toBeVisible();
	});

	test('weather shows a scene and labeled weather icons', async ({ page }) => {
		await startPlaying(page);
		await page.goto('/play/weather');
		await expect(page.getByTestId('play')).toHaveAttribute('data-game', 'weather');
		await expect(page.getByTestId('howto')).toBeVisible();
		await expect(page.getByTestId('weather-example')).toBeVisible();
		await expect(page.getByTestId('weather-scene')).toBeVisible();
		await expect(page.getByTestId('weather-hear')).toHaveAttribute('aria-label', /weather|tempo/i);
		await expect(page.locator('[data-testid="board"] button.choice.wx')).toHaveCount(2);
		await expect(page.locator('[data-testid="board"] button.choice.wx').first()).toHaveAttribute(
			'aria-label',
			/sun|rain|sole|pioggia/i
		);
		await page.getByTestId('weather-hear').click();
		await expect(page.getByTestId('weather-scene')).toBeVisible();
	});

	test('path shows how to walk the bird to the apple', async ({ page }) => {
		await startPlaying(page);
		await page.goto('/play/path');
		await expect(page.getByTestId('play')).toHaveAttribute('data-game', 'path');
		await expect(page.getByTestId('howto')).toBeVisible();
		await expect(page.getByTestId('path-example')).toBeVisible();
		await expect(page.getByTestId('path-hear')).toHaveAttribute('aria-label', /bird|uccello/i);
		await expect(page.getByTestId('path-grid').getByRole('button')).toHaveCount(2);
		await expect(page.getByTestId('path-grid').getByRole('button', { name: /bird|uccello/i })).toBeVisible();
		await expect(page.getByTestId('path-grid').getByRole('button', { name: /apple|mela/i })).toBeVisible();
		await page.getByTestId('path-hear').click();
		await expect(page.getByTestId('howto')).toBeVisible();
	});
});

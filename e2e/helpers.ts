import { expect, type Page } from '@playwright/test';
import { GAME_IDS, type GameId } from '../src/lib/play/types.ts';

export { GAME_IDS, type GameId };

export async function dismissNotice(page: Page) {
	const go = page.getByTestId('go');
	if (await go.isVisible()) {
		await go.click();
		await expect(page.getByTestId('go')).toHaveCount(0);
	}
}

export async function createFriend(page: Page, artId: 'bird' | 'cat' | 'dog' | 'rabbit' = 'bird') {
	if (await page.getByTestId('cottage-paint').evaluate((el) => el.tagName === 'A')) return;
	const nest = page.getByTestId('nest-1');
	await expect(nest).toBeEnabled();
	const friend = page.getByTestId(`friend-${artId}`);
	for (let attempt = 0; attempt < 8; attempt++) {
		if (await friend.isVisible().catch(() => false)) break;
		await nest.click();
		try {
			await friend.waitFor({ state: 'visible', timeout: 400 });
			break;
		} catch {
			await page.waitForTimeout(150);
		}
	}
	await expect(friend).toBeVisible();
	await friend.click();
	await expect(page.getByTestId('cottage-paint')).toHaveAttribute('href', /\/play\/paint/);
}

export async function startPlaying(page: Page, artId: 'bird' | 'cat' | 'dog' | 'rabbit' = 'bird') {
	await page.goto('/');
	await dismissNotice(page);
	await createFriend(page, artId);
}

async function levelFinished(page: Page, startLevel: string) {
	const play = page.getByTestId('play');
	if ((await play.count()) === 0) return false;
	const level = await play.getAttribute('data-level');
	if (level !== startLevel) return true;
	const done = new URL(page.url()).searchParams.get('done');
	return done === startLevel;
}

export async function completeCurrentLevel(page: Page) {
	await expect(page.getByTestId('play')).toBeVisible();
	const game = (await page.getByTestId('play').getAttribute('data-game')) as GameId;
	const startLevel = (await page.getByTestId('play').getAttribute('data-level')) ?? '1';
	const deadline = Date.now() + 60_000;
	while (Date.now() < deadline) {
		if (await levelFinished(page, startLevel)) return;
		await step(page, game);
		if (await levelFinished(page, startLevel)) return;
		await page.waitForTimeout(80);
	}
	throw new Error(`did not finish ${game} level ${startLevel}: ${page.url()}`);
}

export async function playLevelOne(page: Page, game: GameId) {
	await page.goto(`/play/${game}`);
	await expect(page.getByTestId('play')).toHaveAttribute('data-game', game);
	await expect(page.getByTestId('play')).toHaveAttribute('data-level', '1');
	await expect(page.getByTestId('board')).toBeVisible();
	if (game === 'memory') {
		await page.waitForFunction(() => {
			const cards = [...document.querySelectorAll('[data-testid^="card-"]')];
			return cards.length > 0 && cards.every((card) => card.getAttribute('aria-label') === 'card');
		});
	}
	await page.waitForTimeout(800);
	await completeCurrentLevel(page);
	await expect(page.getByTestId('play')).toHaveAttribute('data-level', '2');
}

export async function playThrough(page: Page, game: GameId, until: number = 10) {
	await page.goto(`/play/${game}`);
	for (let n = 1; n <= until; n++) {
		await expect(page.getByTestId('play')).toHaveAttribute('data-game', game);
		await expect(page.getByTestId('play')).toHaveAttribute('data-level', String(n));
		await expect(page.getByTestId('board')).toBeVisible();
		if (game === 'memory') {
			await page
				.waitForFunction(() => {
					const cards = [...document.querySelectorAll('[data-testid^="card-"]')];
					return cards.length > 0 && cards.every((card) => card.getAttribute('aria-label') === 'card');
				})
				.catch(() => {});
		}
		await page.waitForTimeout(n === 1 ? 800 : 120);
		await completeCurrentLevel(page);
		if (n < until) {
			await expect(page.getByTestId('play')).toHaveAttribute('data-level', String(n + 1));
		}
	}
	await expect(page).toHaveURL(/done=10/);
}

async function step(page: Page, game: GameId) {
	if (game === 'paint') return paintStep(page);
	if (game === 'memory') return memoryStep(page);
	if (game === 'stickers') return stickersStep(page);
	if (game === 'sorting' || game === 'categories') return sortStep(page);
	if (game === 'jigsaw') return jigsawStep(page);
	return clickCorrect(page);
}

async function clickCorrect(page: Page) {
	const correct = page.locator('[data-correct="true"]');
	if ((await correct.count()) === 0) return;
	const progress = await page.getByTestId('board').getAttribute('data-progress');
	const prevDone = new URL(page.url()).searchParams.get('done');
	await correct.first().click({ timeout: 5_000 });
	await Promise.race([
		page.waitForURL((url) => url.searchParams.get('done') !== prevDone, { timeout: 4_000 }),
		page.waitForFunction(
			(prev) => {
				const board = document.querySelector('[data-testid="board"]');
				return !board || board.getAttribute('data-progress') !== prev;
			},
			progress,
			{ timeout: 4_000 }
		)
	]).catch(() => {});
}

async function paintStep(page: Page) {
	const progress = Number((await page.getByTestId('board').getAttribute('data-progress')) ?? 0);
	const region = page.locator('[data-testid^="region-"]').nth(progress);
	if ((await region.count()) === 0) return;
	const family = await region.getAttribute('data-family');
	await region.evaluate((el) => (el as SVGElement).dispatchEvent(new MouseEvent('click', { bubbles: true })));
	if (family) {
		await page.locator(`button.swatch[data-family="${family}"]`).evaluate((el) => (el as HTMLButtonElement).click());
	}
}

async function memoryStep(page: Page) {
	await expect(page.locator('[data-testid^="card-"]').first()).toBeVisible();
	await page
		.waitForFunction(() => {
			const cards = [...document.querySelectorAll('[data-testid^="card-"]')];
			return cards.length > 0 && cards.every((card) => card.getAttribute('aria-label') === 'card');
		})
		.catch(() => {});
	const pics = await page
		.locator('[data-testid^="card-"]')
		.evaluateAll((els) => els.map((el) => el.getAttribute('data-pic')));
	const pairs = new Map<string, number[]>();
	pics.forEach((pic, index) => {
		if (!pic) return;
		const list = pairs.get(pic) ?? [];
		list.push(index);
		pairs.set(pic, list);
	});
	for (const indexes of pairs.values()) {
		if (indexes.length < 2) continue;
		await page.getByTestId(`card-${indexes[0]}`).click();
		await page.getByTestId(`card-${indexes[1]}`).click();
	}
}

async function stickersStep(page: Page) {
	const outlines = page.locator('.outline');
	const count = await outlines.count();
	for (let i = 0; i < count; i++) {
		const pic = await outlines.nth(i).getAttribute('data-pic');
		if (!pic) continue;
		await page.locator(`button.choice[data-pic="${pic}"]`).evaluate((el) => (el as HTMLButtonElement).click());
		await outlines.nth(i).click();
	}
}

async function sortStep(page: Page) {
	const item = page.locator('button.choice').first();
	if ((await item.count()) === 0) return;
	const bucket = await item.getAttribute('data-bucket');
	await item.click();
	await page.locator(`button.basket[data-bucket="${bucket}"]`).click();
}

async function jigsawStep(page: Page) {
	const chunk = page.locator('button.choice[data-chunk]').first();
	if ((await chunk.count()) === 0) return;
	const value = Number(await chunk.getAttribute('data-chunk'));
	await chunk.click();
	await page.getByRole('button', { name: `place ${value + 1}` }).click();
}

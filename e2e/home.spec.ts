import { expect, test } from '@playwright/test';
import { GAME_IDS, dismissNotice, startPlaying } from './helpers.ts';

test.describe('home meadow', () => {
	test.describe.configure({ mode: 'serial' });
	test('shows the picture notice until Go', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByTestId('go')).toBeVisible();
		await expect(page.getByTestId('notice-hold')).toBeVisible();
		await expect(page.getByTestId('notice-confirm')).toBeVisible();
		await expect(page.getByTestId('notice-gone')).toBeVisible();
		await expect(page.getByRole('link', { name: 'Written notice' })).toBeVisible();
		await expect(page.getByTestId('nest-1')).toBeDisabled();
		await expect(page.getByTestId('cottage-paint')).not.toHaveAttribute('href');
		await page.getByRole('link', { name: 'Written notice' }).click();
		await expect(page).toHaveURL(/\/notice/);
		await expect(page.getByRole('heading', { name: 'For grown-ups' })).toBeVisible();
		await expect(page.getByText(/remembers play on this device/)).toBeVisible();
		await expect(page.getByText(/ricorda il gioco/)).toBeVisible();
	});

	test('Go unlocks nests, flags, and grown-up links', async ({ page }) => {
		await page.goto('/');
		await dismissNotice(page);
		await expect(page.getByTestId('nest-1')).toBeEnabled();
		await expect(page.getByTestId('flag-it')).toBeVisible();
		await expect(page.getByTestId('flag-en')).toBeVisible();
		await expect(page.getByTestId('leaf')).toBeVisible();
		await expect(page.getByTestId('grownups')).toBeVisible();
		await expect(page.getByTestId('cottage-paint')).not.toHaveAttribute('href');
		await expect(page.getByTestId('pick-friend')).toBeVisible();
		await expect(page.getByTestId('nest-1')).toHaveClass(/need/);
		await page.getByTestId('grownups').click();
		await expect(page).toHaveURL(/\/notice/);
	});

	test('locked cottages and the friend hint open the animal picker', async ({ page }) => {
		await page.goto('/');
		await dismissNotice(page);
		await expect(page.getByTestId('pick-friend')).toBeVisible();
		await page.getByTestId('pick-friend').evaluate((el) => (el as HTMLElement).click());
		await expect(page.getByTestId('picker')).toBeVisible();
		await expect(page.getByTestId('friend-bird')).toBeVisible();
		await page.locator('.close').click();
		await expect(page.getByTestId('picker')).toHaveCount(0);
		await page.getByTestId('cottage-paint').evaluate((el) => (el as HTMLElement).click());
		await expect(page.getByTestId('picker')).toBeVisible();
	});

	test('leaf reopens the picture notice', async ({ page }) => {
		await page.goto('/');
		await dismissNotice(page);
		await expect(page.getByTestId('notice')).toHaveCount(0);
		await page.getByTestId('leaf').click();
		await expect(page).toHaveURL(/pictures=1/);
		await expect(page.getByTestId('notice')).toBeVisible();
		await expect(page.getByRole('link', { name: 'Written notice' })).toBeVisible();
		await page.getByTestId('go').click();
		await expect(page.getByTestId('notice')).toHaveCount(0);
	});

	test('flags switch copy language', async ({ page }) => {
		await page.goto('/');
		await dismissNotice(page);
		await expect(page.getByTestId('flag-it')).toHaveClass(/on/);
		await page.getByTestId('flag-en').click();
		await expect(page.getByTestId('flag-en')).toHaveClass(/on/);
		await expect(page.getByTestId('flag-it')).not.toHaveClass(/on/);
		await page.getByTestId('flag-it').click();
		await expect(page.getByTestId('flag-it')).toHaveClass(/on/);
	});

	test('shows every game cottage in a grid', async ({ page }) => {
		await page.goto('/');
		await dismissNotice(page);
		const games = page.getByTestId('games');
		await expect(games).toBeVisible();
		for (const id of GAME_IDS) {
			await expect(page.getByTestId(`cottage-${id}`)).toBeVisible();
			await expect(page.getByTestId(`mark-${id}`)).toHaveAttribute('data-mark', id);
		}
		const marks = await page.locator('[data-mark]').evaluateAll((els) =>
			els.map((el) => el.getAttribute('data-mark'))
		);
		expect(new Set(marks).size).toBe(GAME_IDS.length);
		await expect(page.getByTestId('cottage-paint').locator('.gname')).toBeVisible();
		await expect(page.getByTestId('cottage-weather').locator('.gname')).toBeVisible();
		const overflow = await games.evaluate((el) => el.scrollWidth > el.clientWidth + 1);
		expect(overflow).toBe(false);
	});

	test('picking a friend turns cottages into play links', async ({ page }) => {
		await startPlaying(page, 'bird');
		await expect(page.getByTestId('nest-1')).toBeVisible();
		for (const game of ['paint', 'memory', 'animals', 'sound-safari']) {
			await expect(page.getByTestId(`cottage-${game}`)).toHaveAttribute(
				'href',
				new RegExp(`/play/${game}`)
			);
		}
		await page.getByTestId('cottage-paint').click();
		await expect(page.getByTestId('play')).toHaveAttribute('data-game', 'paint');
		await page.getByTestId('back').click();
		await expect(page.getByTestId('cottage-paint')).toBeVisible();
	});

	test('creates up to four picture slots', async ({ page }) => {
		await page.goto('/');
		await dismissNotice(page);
		const friends = ['bird', 'cat', 'dog', 'rabbit'] as const;
		for (let i = 0; i < friends.length; i++) {
			const nest = page.getByTestId(`nest-${i + 1}`);
			const friend = page.getByTestId(`friend-${friends[i]}`);
			await expect(nest).toBeEnabled();
			for (let attempt = 0; attempt < 3; attempt++) {
				if (await friend.isVisible().catch(() => false)) break;
				await nest.click();
				if (await friend.isVisible().catch(() => false)) break;
				await page.waitForTimeout(200);
			}
			await expect(friend).toBeVisible();
			await friend.click();
			await expect(page.getByTestId('picker')).toHaveCount(0);
		}
		await expect(page.getByTestId('cottage-paint')).toHaveAttribute('href', /\/play\/paint/);
	});

	test('long-press erase removes a picture slot', async ({ page }) => {
		await startPlaying(page, 'bird');
		await page.getByTestId('nest-1').click({ delay: 700 });
		await expect(page.getByTestId('confirm-erase')).toBeVisible();
		await page.getByTestId('keep-slot').click();
		await expect(page.getByTestId('confirm-erase')).toHaveCount(0);
		await expect(page.getByTestId('cottage-paint')).toHaveAttribute('href', /\/play\/paint/);
		await page.getByTestId('nest-1').click({ delay: 700 });
		await page.getByTestId('confirm-erase').click();
		await expect(page.getByTestId('cottage-paint')).not.toHaveAttribute('href');
	});
});

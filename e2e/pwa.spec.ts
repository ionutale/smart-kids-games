import { expect, test } from '@playwright/test';

test('install manifest and icons are public', async ({ page, request }) => {
	const manifestRes = await request.get('/manifest.webmanifest');
	expect(manifestRes.ok()).toBeTruthy();
	expect(manifestRes.headers()['content-type']).toMatch(/json|webmanifest/);
	const manifest = await manifestRes.json();
	expect(manifest.name).toBe('Smart Kids Games');
	expect(manifest.display).toBe('standalone');
	expect(manifest.start_url).toBe('/');
	expect(manifest.icons).toEqual(
		expect.arrayContaining([
			expect.objectContaining({ src: '/pwa-192.png', sizes: '192x192' }),
			expect.objectContaining({ src: '/pwa-512.png', sizes: '512x512' })
		])
	);

	for (const src of ['/pwa-192.png', '/pwa-512.png', '/pwa-180.png']) {
		const icon = await request.get(src);
		expect(icon.ok(), src).toBeTruthy();
		expect(icon.headers()['content-type']).toMatch(/png/);
	}

	await page.goto('/');
	await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', /manifest\.webmanifest/);
	await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#9fd6f5');
	await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', /pwa-180\.png/);
});

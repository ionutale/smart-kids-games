import { self } from '$app/service-worker';
import { version } from '$app/env';
import { assets, immutable } from '$app/manifest';
import { asset } from '$app/paths';

const CACHE = `cache-${version}`;
const ASSETS: string[] = [
	...immutable.map((file) => (file.path.startsWith('/') ? file.path : `/${file.path}`)),
	...assets.map((file) => asset(file.path))
];

self.addEventListener('install', (event) => {
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		if (ASSETS.includes(url.pathname)) {
			const cached = await cache.match(url.pathname);
			if (cached) return cached;
		}

		try {
			const response = await fetch(event.request);
			if (response.status === 200 && !response.headers.get('cache-control')?.includes('no-store')) {
				void cache.put(event.request, response.clone());
			}
			return response;
		} catch (error) {
			const cached = await cache.match(event.request);
			if (cached) return cached;
			throw error;
		}
	}

	event.respondWith(respond());
});

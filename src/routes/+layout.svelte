<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	afterNavigate(async () => {
		if (!('serviceWorker' in navigator)) return;
		const registration = await navigator.serviceWorker.getRegistration();
		await registration?.update();
	});
</script>

<svelte:head>
	<title>Smart Kids Games</title>
	<meta name="description" content="Cozy brain games for children aged 4 to 6." />
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{@render children()}

<style>
	:global(html, body) {
		margin: 0;
		min-height: 100%;
		font-family: Nunito, 'Avenir Next', 'Segoe UI', sans-serif;
	}
</style>

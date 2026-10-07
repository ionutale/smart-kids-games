<script lang="ts">
	import type { WeatherId } from '../play/weather.ts';

	let { weather, size = 56 }: { weather: WeatherId; size?: number } = $props();
	const stroke = '#3c342b';
</script>

<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
	{#if weather === 'sun'}
		<circle cx="50" cy="50" r="22" fill="#f2c84b" stroke={stroke} stroke-width="3" />
		<g stroke="#e8a24a" stroke-width="4" stroke-linecap="round">
			<path d="M50 12 V22" />
			<path d="M50 78 V88" />
			<path d="M12 50 H22" />
			<path d="M78 50 H88" />
			<path d="M24 24 L31 31" />
			<path d="M69 69 L76 76" />
			<path d="M76 24 L69 31" />
			<path d="M31 69 L24 76" />
		</g>
	{:else if weather === 'rain'}
		<ellipse cx="50" cy="38" rx="26" ry="16" fill="#c5d4de" stroke={stroke} stroke-width="3" />
		<ellipse cx="34" cy="42" rx="14" ry="12" fill="#d8e4ec" stroke={stroke} stroke-width="3" />
		<ellipse cx="64" cy="42" rx="16" ry="13" fill="#b7c8d4" stroke={stroke} stroke-width="3" />
		<g fill="#3b6fd4">
			<ellipse cx="36" cy="72" rx="5" ry="9" />
			<ellipse cx="50" cy="78" rx="5" ry="9" />
			<ellipse cx="64" cy="72" rx="5" ry="9" />
		</g>
	{:else if weather === 'cloud'}
		<ellipse cx="50" cy="54" rx="30" ry="18" fill="#d5dee6" stroke={stroke} stroke-width="3" />
		<ellipse cx="32" cy="50" rx="16" ry="14" fill="#e4eaef" stroke={stroke} stroke-width="3" />
		<ellipse cx="66" cy="48" rx="18" ry="16" fill="#c9d4de" stroke={stroke} stroke-width="3" />
	{:else if weather === 'snow'}
		<g fill="none" stroke="#7aa7d4" stroke-width="4" stroke-linecap="round">
			<path d="M50 18 V82" />
			<path d="M22 50 H78" />
			<path d="M30 30 L70 70" />
			<path d="M70 30 L30 70" />
		</g>
		<circle cx="50" cy="50" r="6" fill="#fffaf2" stroke={stroke} stroke-width="2" />
	{:else if weather === 'wind'}
		<g fill="none" stroke="#6ea8c8" stroke-width="5" stroke-linecap="round">
			<path d="M18 38 C40 28 58 28 82 38" />
			<path d="M14 54 C38 44 62 44 86 54" />
			<path d="M22 70 C42 62 64 62 80 70" />
		</g>
	{:else}
		<ellipse cx="48" cy="42" rx="24" ry="15" fill="#6a7a8c" stroke={stroke} stroke-width="3" />
		<ellipse cx="34" cy="46" rx="14" ry="12" fill="#7b8a9a" stroke={stroke} stroke-width="3" />
		<ellipse cx="62" cy="46" rx="16" ry="13" fill="#5c6b7c" stroke={stroke} stroke-width="3" />
		<polygon points="50,52 62,86 38,86" fill="#f2c84b" stroke={stroke} stroke-width="3" stroke-linejoin="round" />
	{/if}
</svg>

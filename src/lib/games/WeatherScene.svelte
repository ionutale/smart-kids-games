<script lang="ts">
	import type { WeatherId } from '../play/weather.ts';

	let { weather, size = 220 }: { weather: WeatherId; size?: number } = $props();
	const stroke = '#3c342b';
	const sky = {
		sun: ['#9fd6f5', '#f3c4a0'],
		rain: ['#8aa4b8', '#6d8799'],
		cloud: ['#c5d0d8', '#aeb9c4'],
		snow: ['#e4eef8', '#c9d8ea'],
		wind: ['#b7d7ea', '#9ec4d8'],
		storm: ['#5b6b7c', '#3f4d5c']
	} as const;
	const skyId = $derived(`wxsky-${weather}-${size}`);
</script>

<svg class="scene" viewBox="0 0 220 150" width={size} height={size * 0.68} aria-hidden="true">
	<defs>
		<linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stop-color={sky[weather][0]} />
			<stop offset="1" stop-color={sky[weather][1]} />
		</linearGradient>
	</defs>
	<rect width="220" height="150" rx="28" fill={`url(#${skyId})`} />
	{#if weather === 'sun'}
		<circle cx="168" cy="38" r="22" fill="#f2c84b" stroke={stroke} stroke-width="3" />
		<circle cx="160" cy="32" r="7" fill="#ffe9a6" />
	{:else if weather === 'rain'}
		<g fill="#3b6fd4" opacity="0.85">
			<ellipse cx="48" cy="58" rx="4" ry="8" />
			<ellipse cx="78" cy="44" rx="4" ry="8" />
			<ellipse cx="108" cy="62" rx="4" ry="8" />
			<ellipse cx="138" cy="48" rx="4" ry="8" />
			<ellipse cx="168" cy="66" rx="4" ry="8" />
			<ellipse cx="64" cy="78" rx="4" ry="8" />
			<ellipse cx="124" cy="82" rx="4" ry="8" />
			<ellipse cx="184" cy="42" rx="4" ry="8" />
		</g>
		<ellipse cx="70" cy="118" rx="18" ry="5" fill="#6ea8c8" opacity="0.55" />
		<ellipse cx="150" cy="122" rx="22" ry="5" fill="#6ea8c8" opacity="0.45" />
	{:else if weather === 'cloud'}
		<ellipse cx="70" cy="40" rx="32" ry="16" fill="#e8eef3" stroke={stroke} stroke-width="3" />
		<ellipse cx="48" cy="44" rx="16" ry="12" fill="#f4f7fa" stroke={stroke} stroke-width="3" />
		<ellipse cx="150" cy="36" rx="36" ry="18" fill="#d5dee6" stroke={stroke} stroke-width="3" />
		<ellipse cx="128" cy="40" rx="18" ry="14" fill="#e4eaef" stroke={stroke} stroke-width="3" />
	{:else if weather === 'snow'}
		<g fill="#fffaf2">
			<circle cx="40" cy="36" r="4" />
			<circle cx="72" cy="22" r="3" />
			<circle cx="108" cy="40" r="4" />
			<circle cx="146" cy="24" r="3.5" />
			<circle cx="178" cy="42" r="4" />
			<circle cx="54" cy="62" r="3" />
			<circle cx="96" cy="58" r="3.5" />
			<circle cx="164" cy="64" r="3" />
			<circle cx="124" cy="18" r="3" />
		</g>
	{:else if weather === 'wind'}
		<g fill="none" stroke="#fffaf2" stroke-width="4" stroke-linecap="round" opacity="0.9">
			<path d="M24 36 C70 22 120 22 196 38" />
			<path d="M18 56 C80 42 130 44 200 58" />
			<path d="M36 76 C90 64 140 66 188 78" />
		</g>
		<path d="M168 118 C150 86 176 70 186 92" fill="#6ea85a" stroke={stroke} stroke-width="3" />
		<path d="M176 92 C198 74 188 110 176 108" fill="#8fbf73" stroke={stroke} stroke-width="2" />
	{:else}
		<g fill="#2a3440" opacity="0.55">
			<ellipse cx="50" cy="56" rx="4" ry="8" />
			<ellipse cx="90" cy="44" rx="4" ry="8" />
			<ellipse cx="130" cy="60" rx="4" ry="8" />
			<ellipse cx="170" cy="48" rx="4" ry="8" />
		</g>
		<ellipse cx="64" cy="36" rx="28" ry="14" fill="#4a5868" stroke={stroke} stroke-width="3" />
		<ellipse cx="44" cy="40" rx="14" ry="11" fill="#5a6878" stroke={stroke} stroke-width="3" />
		<polygon points="148,28 168,78 128,78" fill="#f2c84b" stroke={stroke} stroke-width="3" stroke-linejoin="round" />
	{/if}
	<path d="M0 108 C50 88 90 118 140 96 C170 84 200 104 220 94 V150 H0 Z" fill={weather === 'snow' ? '#eef4fb' : '#b7c882'} />
	<path d="M0 128 C60 116 110 136 160 122 C190 114 210 128 220 124 V150 H0 Z" fill={weather === 'snow' ? '#dce7f4' : '#9fb56a'} />
	<rect x="28" y="102" width="36" height="28" rx="4" fill="#fff6ea" stroke={stroke} stroke-width="3" />
	<path d="M24 104 L46 86 L68 104" fill="#e8883a" stroke={stroke} stroke-width="3" stroke-linejoin="round" />
	<rect x="40" y="112" width="10" height="16" rx="2" fill="#c48955" stroke={stroke} stroke-width="2" />
	<circle cx="188" cy="118" r="10" fill="#f2c84b" stroke={stroke} stroke-width="3" />
	<ellipse cx="188" cy="122" rx="6" ry="5" fill="#e8b83d" />
	<path d="M196 118 L206 122 L196 126" fill="#e07a3d" stroke={stroke} stroke-width="2" />
</svg>

<style>
	.scene {
		display: block;
		overflow: visible;
		filter: drop-shadow(0 6px 0 rgba(60, 52, 43, 0.12));
	}
</style>

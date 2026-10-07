<script lang="ts">
	import { FAMILY_SWATCH, type ColorFamily } from '../play/pictures.ts';
	import { PAINT_LEVELS, PAINT_REGIONS } from './tables.ts';
	import PaintRegion from './PaintRegion.svelte';
	import type { Level } from '../play/types.ts';

	let {
		level,
		fills,
		selected,
		free,
		onPick
	}: {
		level: Level;
		fills: Array<ColorFamily | null>;
		selected: number | string | null;
		free: boolean;
		onPick: (index: number) => void;
	} = $props();

	const friend = $derived(PAINT_LEVELS[level].friend);
	const stroke = '#3c342b';

	function ink(index: number) {
		const fill = fills[index];
		return fill ? FAMILY_SWATCH[fill] : '#fffaf2';
	}

	function glowing(index: number) {
		return !free && PAINT_LEVELS[level].glow && selected === index;
	}
</script>

<svg class="paint-outline" viewBox="0 0 200 220">
	{#if free}
		<PaintRegion index={0} family={PAINT_REGIONS[level][0]} glow={glowing(0)} {onPick}><ellipse cx="70" cy="80" rx="40" ry="36" fill={ink(0)} stroke={stroke} stroke-width="4" /></PaintRegion>
		<PaintRegion index={1} family={PAINT_REGIONS[level][1]} glow={glowing(1)} {onPick}><ellipse cx="130" cy="80" rx="36" ry="32" fill={ink(1)} stroke={stroke} stroke-width="4" /></PaintRegion>
		<PaintRegion index={2} family={PAINT_REGIONS[level][2]} glow={glowing(2)} {onPick}><ellipse cx="70" cy="150" rx="34" ry="30" fill={ink(2)} stroke={stroke} stroke-width="4" /></PaintRegion>
		<PaintRegion index={3} family={PAINT_REGIONS[level][3]} glow={glowing(3)} {onPick}><ellipse cx="130" cy="150" rx="34" ry="30" fill={ink(3)} stroke={stroke} stroke-width="4" /></PaintRegion>
	{:else if friend === 'bird'}
		<PaintRegion index={0} family={PAINT_REGIONS[level][0]} glow={glowing(0)} {onPick}>
			<ellipse cx="100" cy="110" rx="58" ry="52" fill={ink(0)} stroke={stroke} stroke-width="4" />
			{#if fills.length === 1}
				<polygon points="150,100 186,110 150,122" fill={ink(0)} stroke={stroke} stroke-width="3" />
				<ellipse cx="64" cy="118" rx="20" ry="12" fill={ink(0)} stroke={stroke} stroke-width="3" />
				<ellipse cx="82" cy="176" rx="12" ry="8" fill={ink(0)} stroke={stroke} stroke-width="3" />
				<ellipse cx="118" cy="176" rx="12" ry="8" fill={ink(0)} stroke={stroke} stroke-width="3" />
			{/if}
		</PaintRegion>
		{#if fills.length > 1}
			<PaintRegion index={1} family={PAINT_REGIONS[level][1]} glow={glowing(1)} {onPick}><ellipse cx="100" cy="128" rx="28" ry="22" fill={ink(1)} stroke={stroke} stroke-width="3" /></PaintRegion>
		{/if}
		{#if fills.length > 2}
			<PaintRegion index={2} family={PAINT_REGIONS[level][2]} glow={glowing(2)} {onPick}><polygon points="150,100 186,110 150,122" fill={ink(2)} stroke={stroke} stroke-width="3" /></PaintRegion>
		{/if}
		{#if fills.length > 3}
			<PaintRegion index={3} family={PAINT_REGIONS[level][3]} glow={glowing(3)} {onPick}><circle cx="118" cy="92" r="10" fill={ink(3)} stroke={stroke} stroke-width="3" /></PaintRegion>
		{/if}
		{#if fills.length > 4}
			<PaintRegion index={4} family={PAINT_REGIONS[level][4]} glow={glowing(4)} {onPick}><ellipse cx="64" cy="118" rx="22" ry="14" fill={ink(4)} stroke={stroke} stroke-width="3" /></PaintRegion>
		{/if}
		{#if fills.length > 5}
			<PaintRegion index={5} family={PAINT_REGIONS[level][5]} glow={glowing(5)} {onPick}><polygon points="48,150 28,178 70,168" fill={ink(5)} stroke={stroke} stroke-width="3" /></PaintRegion>
		{/if}
		{#if fills.length > 6}
			<PaintRegion index={6} family={PAINT_REGIONS[level][6]} glow={glowing(6)} {onPick}>
				<ellipse cx="82" cy="176" rx="12" ry="8" fill={ink(6)} stroke={stroke} stroke-width="3" />
				<ellipse cx="118" cy="176" rx="12" ry="8" fill={ink(6)} stroke={stroke} stroke-width="3" />
			</PaintRegion>
		{/if}
	{:else if friend === 'cat'}
		<PaintRegion index={0} family={PAINT_REGIONS[level][0]} glow={glowing(0)} {onPick}>
			<polygon points="48,58 70,18 82,62" fill={ink(0)} stroke={stroke} stroke-width="4" />
			<polygon points="152,58 130,18 118,62" fill={ink(0)} stroke={stroke} stroke-width="4" />
			<ellipse cx="100" cy="118" rx="58" ry="54" fill={ink(0)} stroke={stroke} stroke-width="4" />
		</PaintRegion>
		{#if fills.length > 1}
			<PaintRegion index={1} family={PAINT_REGIONS[level][1]} glow={glowing(1)} {onPick}><ellipse cx="100" cy="138" rx="28" ry="20" fill={ink(1)} stroke={stroke} stroke-width="3" /></PaintRegion>
		{/if}
		{#if fills.length > 2}
			<PaintRegion index={2} family={PAINT_REGIONS[level][2]} glow={glowing(2)} {onPick}><ellipse cx="100" cy="128" rx="10" ry="8" fill={ink(2)} stroke={stroke} stroke-width="3" /></PaintRegion>
		{/if}
		{#if fills.length > 3}
			<PaintRegion index={3} family={PAINT_REGIONS[level][3]} glow={glowing(3)} {onPick}>
				<polygon points="58,48 70,26 78,56" fill={ink(3)} stroke={stroke} stroke-width="3" />
				<polygon points="142,48 130,26 122,56" fill={ink(3)} stroke={stroke} stroke-width="3" />
			</PaintRegion>
		{/if}
		{#if fills.length > 4}
			<PaintRegion index={4} family={PAINT_REGIONS[level][4]} glow={glowing(4)} {onPick}>
				<circle cx="82" cy="108" r="8" fill={ink(4)} stroke={stroke} stroke-width="3" />
				<circle cx="118" cy="108" r="8" fill={ink(4)} stroke={stroke} stroke-width="3" />
			</PaintRegion>
		{/if}
		{#if fills.length > 5}
			<PaintRegion index={5} family={PAINT_REGIONS[level][5]} glow={glowing(5)} {onPick}><path d="M70 42 Q100 8 130 42 L120 58 Q100 28 80 58 Z" fill={ink(5)} stroke={stroke} stroke-width="3" /></PaintRegion>
		{/if}
		{#if fills.length > 6}
			<PaintRegion index={6} family={PAINT_REGIONS[level][6]} glow={glowing(6)} {onPick}><path d="M72 160 Q100 188 128 160 L120 148 Q100 168 80 148 Z" fill={ink(6)} stroke={stroke} stroke-width="3" /></PaintRegion>
		{/if}
		{#if fills.length > 7}
			<PaintRegion index={7} family={PAINT_REGIONS[level][7]} glow={glowing(7)} {onPick}>
				<ellipse cx="78" cy="188" rx="16" ry="10" fill={ink(7)} stroke={stroke} stroke-width="3" />
				<ellipse cx="122" cy="188" rx="16" ry="10" fill={ink(7)} stroke={stroke} stroke-width="3" />
			</PaintRegion>
		{/if}
	{:else if friend === 'dog'}
		<PaintRegion index={0} family={PAINT_REGIONS[level][0]} glow={glowing(0)} {onPick}>
			<ellipse cx="42" cy="78" rx="16" ry="28" fill={ink(0)} stroke={stroke} stroke-width="4" />
			<ellipse cx="158" cy="78" rx="16" ry="28" fill={ink(0)} stroke={stroke} stroke-width="4" />
			<ellipse cx="100" cy="120" rx="58" ry="52" fill={ink(0)} stroke={stroke} stroke-width="4" />
		</PaintRegion>
		{#if fills.length > 1}
			<PaintRegion index={1} family={PAINT_REGIONS[level][1]} glow={glowing(1)} {onPick}><ellipse cx="100" cy="140" rx="30" ry="22" fill={ink(1)} stroke={stroke} stroke-width="3" /></PaintRegion>
		{/if}
		{#if fills.length > 2}
			<PaintRegion index={2} family={PAINT_REGIONS[level][2]} glow={glowing(2)} {onPick}><ellipse cx="100" cy="148" rx="14" ry="10" fill={ink(2)} stroke={stroke} stroke-width="3" /></PaintRegion>
		{/if}
		{#if fills.length > 3}
			<PaintRegion index={3} family={PAINT_REGIONS[level][3]} glow={glowing(3)} {onPick}>
				<ellipse cx="42" cy="78" rx="16" ry="28" fill={ink(3)} stroke={stroke} stroke-width="3" />
				<ellipse cx="158" cy="78" rx="16" ry="28" fill={ink(3)} stroke={stroke} stroke-width="3" />
			</PaintRegion>
		{/if}
		{#if fills.length > 4}
			<PaintRegion index={4} family={PAINT_REGIONS[level][4]} glow={glowing(4)} {onPick}>
				<circle cx="82" cy="108" r="8" fill={ink(4)} stroke={stroke} stroke-width="3" />
				<circle cx="118" cy="108" r="8" fill={ink(4)} stroke={stroke} stroke-width="3" />
			</PaintRegion>
		{/if}
		{#if fills.length > 5}
			<PaintRegion index={5} family={PAINT_REGIONS[level][5]} glow={glowing(5)} {onPick}><rect x="70" y="168" width="60" height="18" rx="8" fill={ink(5)} stroke={stroke} stroke-width="3" /></PaintRegion>
		{/if}
	{:else}
		<PaintRegion index={0} family={PAINT_REGIONS[level][0]} glow={glowing(0)} {onPick}>
			<ellipse cx="52" cy="48" rx="14" ry="36" fill={ink(0)} stroke={stroke} stroke-width="4" />
			<ellipse cx="148" cy="48" rx="14" ry="36" fill={ink(0)} stroke={stroke} stroke-width="4" />
			<ellipse cx="100" cy="128" rx="58" ry="52" fill={ink(0)} stroke={stroke} stroke-width="4" />
		</PaintRegion>
		{#if fills.length > 1}
			<PaintRegion index={1} family={PAINT_REGIONS[level][1]} glow={glowing(1)} {onPick}><ellipse cx="100" cy="148" rx="28" ry="20" fill={ink(1)} stroke={stroke} stroke-width="3" /></PaintRegion>
		{/if}
		{#if fills.length > 2}
			<PaintRegion index={2} family={PAINT_REGIONS[level][2]} glow={glowing(2)} {onPick}>
				<ellipse cx="52" cy="48" rx="7" ry="22" fill={ink(2)} stroke={stroke} stroke-width="3" />
				<ellipse cx="148" cy="48" rx="7" ry="22" fill={ink(2)} stroke={stroke} stroke-width="3" />
			</PaintRegion>
		{/if}
		{#if fills.length > 3}
			<PaintRegion index={3} family={PAINT_REGIONS[level][3]} glow={glowing(3)} {onPick}>
				<ellipse cx="52" cy="48" rx="14" ry="36" fill={ink(3)} stroke={stroke} stroke-width="3" />
				<ellipse cx="148" cy="48" rx="14" ry="36" fill={ink(3)} stroke={stroke} stroke-width="3" />
			</PaintRegion>
		{/if}
		{#if fills.length > 4}
			<PaintRegion index={4} family={PAINT_REGIONS[level][4]} glow={glowing(4)} {onPick}><ellipse cx="100" cy="138" rx="8" ry="6" fill={ink(4)} stroke={stroke} stroke-width="3" /></PaintRegion>
		{/if}
		{#if fills.length > 5}
			<PaintRegion index={5} family={PAINT_REGIONS[level][5]} glow={glowing(5)} {onPick}>
				<circle cx="82" cy="118" r="8" fill={ink(5)} stroke={stroke} stroke-width="3" />
				<circle cx="118" cy="118" r="8" fill={ink(5)} stroke={stroke} stroke-width="3" />
			</PaintRegion>
		{/if}
		{#if fills.length > 6}
			<PaintRegion index={6} family={PAINT_REGIONS[level][6]} glow={glowing(6)} {onPick}><path d="M70 160 Q100 200 130 160 L122 150 Q100 178 78 150 Z" fill={ink(6)} stroke={stroke} stroke-width="3" /></PaintRegion>
		{/if}
	{/if}
</svg>

<style>
	.paint-outline {
		width: min(280px, 80vw);
		height: auto;
		overflow: visible;
		touch-action: none;
	}
</style>

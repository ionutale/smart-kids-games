<script lang="ts">
	import FriendFace from './FriendFace.svelte';
	import type { GameId } from './types.ts';
	import { piecePath, pieceTabs } from '../games/jigsaw.ts';

	let { game, size = 64 }: { game: GameId; size?: number } = $props();

	const stroke = '#3c342b';
	const jigSlot = 38;
	const jigPad = 11;
	const jigBox = jigSlot * 2 + jigPad * 2;
	const jigColors = ['#e8883a', '#f2c84b', '#6ea85a', '#3b6fd4'] as const;
</script>

<span class="mark" data-testid="mark-{game}" data-mark={game} style="width:{size}px;height:{size}px">
	{#if game === 'paint'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<circle cx="42" cy="52" r="34" fill="#fff6ea" stroke={stroke} stroke-width="3" />
			<path d="M42 18 A34 34 0 0 0 42 86" fill="#f2c84b" stroke={stroke} stroke-width="3" />
			<circle cx="78" cy="78" r="14" fill="#fffaf2" stroke={stroke} stroke-width="3" />
			<circle cx="72" cy="74" r="5" fill="#ce2b37" />
			<circle cx="84" cy="74" r="5" fill="#3b6fd4" />
			<circle cx="78" cy="84" r="5" fill="#6ea85a" />
			<path d="M58 40 L90 14" stroke="#8a5a3a" stroke-width="7" stroke-linecap="round" />
			<path d="M84 8 L96 20 L90 26 L78 14 Z" fill="#f2c84b" stroke={stroke} stroke-width="3" />
			<circle cx="94" cy="12" r="5" fill="#ce2b37" stroke={stroke} stroke-width="2" />
		</svg>
	{:else if game === 'memory'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<rect x="4" y="20" width="44" height="64" rx="10" fill="#c48955" stroke={stroke} stroke-width="3" />
			<rect x="12" y="28" width="28" height="48" rx="6" fill="#e8c07a" />
			<circle cx="26" cy="52" r="8" fill="#f2c84b" stroke={stroke} stroke-width="2" />
			<rect x="50" y="12" width="46" height="66" rx="10" fill="#fffaf2" stroke={stroke} stroke-width="3" />
			<g transform="translate(52,18) scale(0.42)"><FriendFace artId="cat" size={100} /></g>
		</svg>
	{:else if game === 'animals'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<g transform="translate(-6,8) scale(0.62)"><FriendFace artId="bird" size={100} /></g>
			<g transform="translate(38,18) scale(0.62)"><FriendFace artId="cat" size={100} /></g>
		</svg>
	{:else if game === 'vehicles'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<rect x="18" y="8" width="42" height="26" rx="6" fill="#3b6fd4" stroke={stroke} stroke-width="3" />
			<rect x="46" y="2" width="12" height="16" rx="3" fill="#ce2b37" stroke={stroke} stroke-width="2" />
			<circle cx="30" cy="36" r="6" fill={stroke} />
			<circle cx="48" cy="36" r="6" fill={stroke} />
			<path d="M6 70 L20 50 H62 L86 70 Z" fill="#ce2b37" stroke={stroke} stroke-width="3" stroke-linejoin="round" />
			<rect x="4" y="68" width="84" height="16" rx="7" fill="#ce2b37" stroke={stroke} stroke-width="3" />
			<rect x="24" y="54" width="16" height="12" rx="3" fill="#d7f0fb" stroke={stroke} stroke-width="2" />
			<rect x="46" y="54" width="16" height="12" rx="3" fill="#d7f0fb" stroke={stroke} stroke-width="2" />
			<circle cx="26" cy="86" r="9" fill={stroke} />
			<circle cx="68" cy="86" r="9" fill={stroke} />
			<circle cx="26" cy="86" r="3.5" fill="#fffaf2" />
			<circle cx="68" cy="86" r="3.5" fill="#fffaf2" />
		</svg>
	{:else if game === 'food'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<circle cx="30" cy="58" r="26" fill="#ce2b37" stroke={stroke} stroke-width="3" />
			<ellipse cx="22" cy="50" rx="8" ry="6" fill="#e8888a" />
			<path d="M30 34 C30 20 42 16 48 24" fill="none" stroke="#8a5a3a" stroke-width="4" stroke-linecap="round" />
			<ellipse cx="46" cy="28" rx="9" ry="6" fill="#6ea85a" stroke={stroke} stroke-width="2" />
			<path
				d="M58 14 C62 50 78 88 108 76 C84 84 62 50 60 16 Z"
				fill="#f2c84b"
				stroke={stroke}
				stroke-width="3"
				stroke-linejoin="round"
			/>
			<path d="M64 22 C70 50 84 74 102 76" fill="none" stroke="#e8883a" stroke-width="2.5" />
			<ellipse cx="62" cy="22" rx="4" ry="5" fill="#6ea85a" />
		</svg>
	{:else if game === 'shapes'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<polygon points="32,8 62,78 2,78" fill="#f2c84b" stroke={stroke} stroke-width="3" stroke-linejoin="round" />
			<circle cx="70" cy="58" r="26" fill="#ce2b37" stroke={stroke} stroke-width="3" />
			<ellipse cx="62" cy="50" rx="8" ry="6" fill="#e8888a" />
		</svg>
	{:else if game === 'clothes'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<path
				d="M10 28 L32 14 L50 32 L68 14 L90 28 L78 44 V90 H22 V44 Z"
				fill="#3b6fd4"
				stroke={stroke}
				stroke-width="3"
				stroke-linejoin="round"
			/>
			<circle cx="50" cy="40" r="5" fill="#fffaf2" stroke={stroke} stroke-width="2" />
			<ellipse cx="34" cy="52" rx="8" ry="6" fill="#6e92e0" />
		</svg>
	{:else if game === 'toys'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<circle cx="42" cy="48" r="32" fill="#e8883a" stroke={stroke} stroke-width="3" />
			<path d="M42 16 C30 38 30 58 42 80 M42 16 C54 38 54 58 42 80 M12 48 H72" fill="none" stroke="#fffaf2" stroke-width="3" />
			<rect x="58" y="58" width="32" height="32" rx="6" fill="#3b6fd4" stroke={stroke} stroke-width="3" />
			<rect x="70" y="42" width="24" height="24" rx="5" fill="#f2c84b" stroke={stroke} stroke-width="3" />
		</svg>
	{:else if game === 'instruments'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<path d="M16 42 V72 C16 88 84 88 84 72 V42" fill="#ce2b37" stroke={stroke} stroke-width="3" />
			<ellipse cx="50" cy="42" rx="34" ry="16" fill="#fffaf2" stroke={stroke} stroke-width="3" />
			<line x1="28" y1="50" x2="28" y2="74" stroke="#f2c84b" stroke-width="4" />
			<line x1="72" y1="50" x2="72" y2="74" stroke="#f2c84b" stroke-width="4" />
			<line x1="70" y1="8" x2="86" y2="40" stroke="#8a5a3a" stroke-width="5" stroke-linecap="round" />
			<line x1="86" y1="6" x2="96" y2="38" stroke="#8a5a3a" stroke-width="5" stroke-linecap="round" />
		</svg>
	{:else if game === 'little-phrase'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<path
				d="M12 18 H88 A8 8 0 0 1 96 26 V62 A8 8 0 0 1 88 70 H44 L28 90 L32 70 H12 A8 8 0 0 1 4 62 V26 A8 8 0 0 1 12 18 Z"
				fill="#fffaf2"
				stroke={stroke}
				stroke-width="3"
			/>
			<circle cx="50" cy="42" r="18" fill="#ce2b37" stroke={stroke} stroke-width="3" />
			<path d="M50 24 C40 36 40 48 50 60 M50 24 C60 36 60 48 50 60 M34 42 H66" fill="none" stroke="#fffaf2" stroke-width="2.5" />
		</svg>
	{:else if game === 'count'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<circle cx="20" cy="28" r="16" fill="#ce2b37" stroke={stroke} stroke-width="3" />
			<ellipse cx="16" cy="22" rx="5" ry="4" fill="#e8888a" />
			<path d="M20 14 C22 6 30 6 32 12" fill="none" stroke="#8a5a3a" stroke-width="3" stroke-linecap="round" />
			<circle cx="50" cy="22" r="16" fill="#ce2b37" stroke={stroke} stroke-width="3" />
			<ellipse cx="46" cy="16" rx="5" ry="4" fill="#e8888a" />
			<path d="M50 8 C52 0 60 0 62 6" fill="none" stroke="#8a5a3a" stroke-width="3" stroke-linecap="round" />
			<circle cx="80" cy="28" r="16" fill="#ce2b37" stroke={stroke} stroke-width="3" />
			<ellipse cx="76" cy="22" rx="5" ry="4" fill="#e8888a" />
			<path d="M80 14 C82 6 90 6 92 12" fill="none" stroke="#8a5a3a" stroke-width="3" stroke-linecap="round" />
			<text
				x="50"
				y="86"
				text-anchor="middle"
				fill={stroke}
				font-size="40"
				font-weight="800"
				font-family="Nunito, 'Avenir Next', 'Segoe UI', sans-serif">3</text
			>
		</svg>
	{:else if game === 'math'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<circle cx="28" cy="24" r="16" fill="#ce2b37" stroke={stroke} stroke-width="3" />
			<path d="M28 10 C30 2 38 2 40 8" fill="none" stroke="#8a5a3a" stroke-width="3" stroke-linecap="round" />
			<circle cx="72" cy="24" r="16" fill="#ce2b37" stroke={stroke} stroke-width="3" />
			<path d="M72 10 C74 2 82 2 84 8" fill="none" stroke="#8a5a3a" stroke-width="3" stroke-linecap="round" />
			<path d="M38 50 H62 M50 38 V62" stroke={stroke} stroke-width="6" stroke-linecap="round" />
			<circle cx="28" cy="80" r="16" fill="#ce2b37" stroke={stroke} stroke-width="3" />
			<path d="M28 66 C30 58 38 58 40 64" fill="none" stroke="#8a5a3a" stroke-width="3" stroke-linecap="round" />
			<circle cx="72" cy="80" r="16" fill="#ce2b37" stroke={stroke} stroke-width="3" />
			<path d="M72 66 C74 58 82 58 84 64" fill="none" stroke="#8a5a3a" stroke-width="3" stroke-linecap="round" />
		</svg>
	{:else if game === 'stickers'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<circle cx="38" cy="58" r="28" fill="none" stroke={stroke} stroke-width="3.5" stroke-dasharray="7 6" />
			<circle cx="62" cy="36" r="26" fill="#ce2b37" stroke={stroke} stroke-width="3" />
			<ellipse cx="54" cy="28" rx="8" ry="6" fill="#e8888a" />
			<path d="M62 12 C62 2 74 2 78 12" fill="none" stroke="#8a5a3a" stroke-width="3.5" stroke-linecap="round" />
			<ellipse cx="74" cy="16" rx="10" ry="6" fill="#6ea85a" stroke={stroke} stroke-width="2" />
		</svg>
	{:else if game === 'sorting'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<path d="M6 40 L12 86 H36 L42 40 Z" fill="#c48955" stroke={stroke} stroke-width="3" stroke-linejoin="round" />
			<path d="M4 38 H44 L40 48 H8 Z" fill="#e8a05a" stroke={stroke} stroke-width="3" />
			<path d="M52 28 L62 90 H96 L86 28 Z" fill="#c48955" stroke={stroke} stroke-width="3" stroke-linejoin="round" />
			<path d="M48 26 H90 L84 38 H54 Z" fill="#e8a05a" stroke={stroke} stroke-width="3" />
			<circle cx="24" cy="28" r="9" fill="#3b6fd4" stroke={stroke} stroke-width="2.5" />
			<circle cx="72" cy="14" r="16" fill="#3b6fd4" stroke={stroke} stroke-width="2.5" />
		</svg>
	{:else if game === 'categories'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<path d="M4 42 L12 90 H40 L48 42 Z" fill="#c48955" stroke={stroke} stroke-width="3" stroke-linejoin="round" />
			<path d="M2 40 H50 L46 50 H6 Z" fill="#e8a05a" stroke={stroke} stroke-width="3" />
			<path d="M52 42 L60 90 H88 L96 42 Z" fill="#c48955" stroke={stroke} stroke-width="3" stroke-linejoin="round" />
			<path d="M50 40 H98 L94 50 H54 Z" fill="#e8a05a" stroke={stroke} stroke-width="3" />
			<circle cx="26" cy="26" r="14" fill="#ce2b37" stroke={stroke} stroke-width="2.5" />
			<path d="M26 14 C28 6 36 6 38 12" fill="none" stroke="#8a5a3a" stroke-width="3" stroke-linecap="round" />
			<path d="M62 28 L70 16 H86 L94 28 Z" fill="#ce2b37" stroke={stroke} stroke-width="2.5" stroke-linejoin="round" />
			<rect x="60" y="26" width="36" height="10" rx="3" fill="#ce2b37" stroke={stroke} stroke-width="2" />
			<circle cx="70" cy="38" r="4" fill={stroke} />
			<circle cx="86" cy="38" r="4" fill={stroke} />
		</svg>
	{:else if game === 'speed'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<circle cx="28" cy="58" r="22" fill="#ce2b37" stroke={stroke} stroke-width="3" />
			<polygon points="54,8 62,36 74,36 48,92 56,48 36,48" fill="#f2c84b" stroke={stroke} stroke-width="3" stroke-linejoin="round" />
			<circle cx="78" cy="58" r="22" fill="#ce2b37" stroke={stroke} stroke-width="3" />
		</svg>
	{:else if game === 'next'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<circle cx="18" cy="40" r="16" fill="#f2c84b" stroke={stroke} stroke-width="3" />
			<rect x="38" y="24" width="28" height="32" rx="6" fill="#e8883a" stroke={stroke} stroke-width="3" />
			<circle cx="84" cy="40" r="16" fill="#f2c84b" stroke={stroke} stroke-width="3" />
			<text
				x="50"
				y="90"
				text-anchor="middle"
				fill={stroke}
				font-size="36"
				font-weight="800"
				font-family="Nunito, 'Avenir Next', 'Segoe UI', sans-serif">?</text
			>
		</svg>
	{:else if game === 'path'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<g transform="translate(-8,-4) scale(0.5)"><FriendFace artId="bird" size={100} /></g>
			<circle cx="40" cy="58" r="8" fill="#6ea85a" stroke={stroke} stroke-width="3" />
			<circle cx="58" cy="70" r="8" fill="#6ea85a" stroke={stroke} stroke-width="3" />
			<circle cx="74" cy="78" r="8" fill="#6ea85a" stroke={stroke} stroke-width="3" />
			<circle cx="86" cy="52" r="16" fill="#ce2b37" stroke={stroke} stroke-width="3" />
			<ellipse cx="80" cy="46" rx="5" ry="4" fill="#e8888a" />
			<path d="M86 38 C88 28 96 28 98 36" fill="none" stroke="#8a5a3a" stroke-width="3" stroke-linecap="round" />
		</svg>
	{:else if game === 'jigsaw'}
		<svg viewBox="0 0 {jigBox} {jigBox}" width={size} height={size} aria-hidden="true">
			{#each jigColors as color, i}
				<g transform="translate({(i % 2) * jigSlot} {Math.floor(i / 2) * jigSlot})">
					<path
						d={piecePath(jigSlot, jigSlot, jigPad, pieceTabs(i % 2, Math.floor(i / 2), 2, 2))}
						fill={color}
						stroke={stroke}
						stroke-width="3"
						stroke-linejoin="round"
					/>
				</g>
			{/each}
		</svg>
	{:else if game === 'odd-one-out'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<circle cx="22" cy="38" r="18" fill="#ce2b37" stroke={stroke} stroke-width="3" />
			<path d="M22 22 C24 12 32 12 34 20" fill="none" stroke="#8a5a3a" stroke-width="3" stroke-linecap="round" />
			<circle cx="50" cy="38" r="18" fill="#ce2b37" stroke={stroke} stroke-width="3" />
			<path d="M50 22 C52 12 60 12 62 20" fill="none" stroke="#8a5a3a" stroke-width="3" stroke-linecap="round" />
			<circle cx="78" cy="62" r="26" fill="none" stroke="#f0c14a" stroke-width="4" />
			<path d="M64 58 L74 44 H86 L94 58 Z" fill="#ce2b37" stroke={stroke} stroke-width="2.5" stroke-linejoin="round" />
			<rect x="62" y="56" width="34" height="10" rx="3" fill="#ce2b37" stroke={stroke} stroke-width="2" />
			<circle cx="72" cy="68" r="5" fill={stroke} />
			<circle cx="88" cy="68" r="5" fill={stroke} />
		</svg>
	{:else if game === 'shadow'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<g transform="translate(-8,8) scale(0.58)"><FriendFace artId="dog" size={100} /></g>
			<ellipse cx="78" cy="62" rx="18" ry="28" fill="#3c342b" />
			<ellipse cx="78" cy="38" rx="14" ry="14" fill="#3c342b" />
			<ellipse cx="66" cy="30" rx="7" ry="10" fill="#3c342b" />
			<ellipse cx="88" cy="30" rx="7" ry="10" fill="#3c342b" />
		</svg>
	{:else if game === 'weather'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<circle cx="28" cy="28" r="20" fill="#f2c84b" stroke={stroke} stroke-width="3" />
			<g stroke="#e8a24a" stroke-width="3.5" stroke-linecap="round">
				<path d="M28 4 V12" />
				<path d="M4 28 H12" />
				<path d="M10 10 L16 16" />
			</g>
			<ellipse cx="70" cy="36" rx="26" ry="16" fill="#c5d4de" stroke={stroke} stroke-width="3" />
			<ellipse cx="54" cy="38" rx="14" ry="12" fill="#d8e4ec" stroke={stroke} stroke-width="3" />
			<g fill="#3b6fd4">
				<ellipse cx="58" cy="68" rx="5" ry="12" />
				<ellipse cx="74" cy="76" rx="5" ry="12" />
			</g>
			<path d="M18 86 L32 70 H52 L66 86 Z" fill="#c48955" stroke={stroke} stroke-width="3" />
			<rect x="28" y="86" width="28" height="10" fill="#e8c07a" stroke={stroke} stroke-width="2" />
		</svg>
	{:else}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<polygon points="8,36 36,36 62,10 62,90 36,64 8,64" fill="#3c342b" />
			<path d="M70 28 C88 42 88 62 70 76" fill="none" stroke="#3c342b" stroke-width="7" stroke-linecap="round" />
			<path d="M82 14 C106 38 106 70 82 90" fill="none" stroke="#3c342b" stroke-width="7" stroke-linecap="round" />
			<g transform="translate(48,48) scale(0.42)"><FriendFace artId="bird" size={100} /></g>
		</svg>
	{/if}
</span>

<style>
	.mark {
		display: inline-grid;
		place-items: center;
	}
	.mark :global(svg) {
		display: block;
		overflow: visible;
	}
</style>

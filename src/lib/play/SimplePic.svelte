<script lang="ts">
	import FriendFace from './FriendFace.svelte';
	import { FAMILY_SWATCH, type PicId } from './pictures.ts';
	import type { FriendArtId } from './types.ts';

	let { pic, size = 72, shadow = false }: { pic: PicId; size?: number; shadow?: boolean } = $props();

	const friend = $derived(['bird', 'cat', 'dog', 'rabbit'].includes(pic));
	const stroke = '#3c342b';
</script>

<span class="pic" class:shadow style="width:{size}px;height:{size}px">
	{#if friend}
		<FriendFace artId={pic as FriendArtId} {size} />
	{:else if pic === 'red-circle'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<ellipse cx="50" cy="88" rx="26" ry="6" fill="#3c342b" opacity="0.12" />
			<circle cx="50" cy="50" r="34" fill={FAMILY_SWATCH.red} stroke={stroke} stroke-width="3" />
			<ellipse cx="38" cy="40" rx="12" ry="8" fill="#f7a0a6" />
		</svg>
	{:else if pic === 'yellow-triangle'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<ellipse cx="50" cy="88" rx="26" ry="6" fill="#3c342b" opacity="0.12" />
			<polygon points="50,14 86,82 14,82" fill={FAMILY_SWATCH.yellow} stroke={stroke} stroke-width="3" stroke-linejoin="round" />
			<ellipse cx="44" cy="48" rx="8" ry="10" fill="#ffe9a6" />
		</svg>
	{:else if pic === 'blue-square'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<ellipse cx="50" cy="88" rx="26" ry="6" fill="#3c342b" opacity="0.12" />
			<rect x="18" y="18" width="64" height="64" rx="14" fill={FAMILY_SWATCH.blue} stroke={stroke} stroke-width="3" />
			<ellipse cx="36" cy="36" rx="12" ry="8" fill="#8eb4f0" />
		</svg>
	{:else if pic === 'green-star'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<ellipse cx="50" cy="90" rx="24" ry="5" fill="#3c342b" opacity="0.12" />
			<polygon
				points="50,8 62,38 94,38 68,58 78,90 50,70 22,90 32,58 6,38 38,38"
				fill={FAMILY_SWATCH.green}
				stroke={stroke}
				stroke-width="3"
				stroke-linejoin="round"
			/>
			<ellipse cx="44" cy="36" rx="8" ry="6" fill="#b5d89a" />
		</svg>
	{:else if pic === 'car'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<ellipse cx="50" cy="88" rx="32" ry="6" fill="#3c342b" opacity="0.12" />
			<path d="M16 60 L28 38 H70 L86 60 Z" fill="#ce2b37" stroke={stroke} stroke-width="3" stroke-linejoin="round" />
			<rect x="12" y="58" width="76" height="20" rx="8" fill="#ce2b37" stroke={stroke} stroke-width="3" />
			<rect x="30" y="42" width="18" height="14" rx="4" fill="#d7f0fb" stroke={stroke} stroke-width="2" />
			<rect x="52" y="42" width="16" height="14" rx="4" fill="#d7f0fb" stroke={stroke} stroke-width="2" />
			<ellipse cx="28" cy="42" rx="6" ry="4" fill="#e8883a" />
			<circle cx="30" cy="78" r="10" fill="#3c342b" />
			<circle cx="70" cy="78" r="10" fill="#3c342b" />
			<circle cx="30" cy="78" r="4.5" fill="#fffaf2" />
			<circle cx="70" cy="78" r="4.5" fill="#fffaf2" />
		</svg>
	{:else if pic === 'bus'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<ellipse cx="50" cy="88" rx="34" ry="6" fill="#3c342b" opacity="0.12" />
			<rect x="8" y="28" width="84" height="44" rx="12" fill="#f2c84b" stroke={stroke} stroke-width="3" />
			<rect x="16" y="36" width="14" height="16" rx="3" fill="#d7f0fb" stroke={stroke} stroke-width="2" />
			<rect x="36" y="36" width="14" height="16" rx="3" fill="#d7f0fb" stroke={stroke} stroke-width="2" />
			<rect x="56" y="36" width="14" height="16" rx="3" fill="#d7f0fb" stroke={stroke} stroke-width="2" />
			<rect x="76" y="36" width="8" height="16" rx="3" fill="#d7f0fb" stroke={stroke} stroke-width="2" />
			<rect x="8" y="58" width="84" height="8" fill="#e07a3d" />
			<circle cx="28" cy="76" r="9" fill="#3c342b" />
			<circle cx="72" cy="76" r="9" fill="#3c342b" />
			<circle cx="28" cy="76" r="4" fill="#fffaf2" />
			<circle cx="72" cy="76" r="4" fill="#fffaf2" />
		</svg>
	{:else if pic === 'bike'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<ellipse cx="50" cy="90" rx="30" ry="5" fill="#3c342b" opacity="0.12" />
			<circle cx="28" cy="68" r="17" fill="#fffaf2" stroke={stroke} stroke-width="4" />
			<circle cx="72" cy="68" r="17" fill="#fffaf2" stroke={stroke} stroke-width="4" />
			<circle cx="28" cy="68" r="5" fill="#6ea85a" />
			<circle cx="72" cy="68" r="5" fill="#6ea85a" />
			<path d="M28 68 L50 38 L72 68 M50 38 L50 26 M40 26 H64" fill="none" stroke={stroke} stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
			<path d="M50 38 L36 68" fill="none" stroke="#6ea85a" stroke-width="4" stroke-linecap="round" />
		</svg>
	{:else if pic === 'train'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<ellipse cx="50" cy="90" rx="32" ry="5" fill="#3c342b" opacity="0.12" />
			<rect x="16" y="36" width="56" height="34" rx="8" fill="#3b6fd4" stroke={stroke} stroke-width="3" />
			<rect x="54" y="18" width="18" height="24" rx="5" fill="#ce2b37" stroke={stroke} stroke-width="3" />
			<rect x="22" y="44" width="16" height="12" rx="3" fill="#d7f0fb" stroke={stroke} stroke-width="2" />
			<rect x="42" y="44" width="16" height="12" rx="3" fill="#d7f0fb" stroke={stroke} stroke-width="2" />
			<circle cx="28" cy="78" r="9" fill="#3c342b" />
			<circle cx="58" cy="78" r="9" fill="#3c342b" />
			<rect x="74" y="46" width="14" height="20" rx="4" fill="#8a5a3a" stroke={stroke} stroke-width="2.5" />
			<ellipse cx="83" cy="22" rx="6" ry="8" fill="#c8c2bc" opacity="0.8" />
		</svg>
	{:else if pic === 'apple'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<ellipse cx="50" cy="90" rx="24" ry="5" fill="#3c342b" opacity="0.12" />
			<circle cx="50" cy="58" r="28" fill="#ce2b37" stroke={stroke} stroke-width="3" />
			<ellipse cx="40" cy="48" rx="10" ry="8" fill="#e8888a" />
			<path d="M50 32 C50 18 62 14 70 20" fill="none" stroke="#8a5a3a" stroke-width="4" stroke-linecap="round" />
			<ellipse cx="64" cy="28" rx="11" ry="7" fill="#6ea85a" stroke={stroke} stroke-width="2" />
		</svg>
	{:else if pic === 'banana'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<ellipse cx="50" cy="90" rx="26" ry="5" fill="#3c342b" opacity="0.12" />
			<path
				d="M22 26 C26 64 48 88 82 80 C58 80 34 58 30 26 Z"
				fill="#f2c84b"
				stroke={stroke}
				stroke-width="3"
				stroke-linejoin="round"
			/>
			<path d="M30 30 C42 54 60 72 80 76" fill="none" stroke="#e8883a" stroke-width="2.5" />
			<ellipse cx="36" cy="36" rx="6" ry="8" fill="#ffe9a6" />
		</svg>
	{:else if pic === 'bread'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<ellipse cx="50" cy="88" rx="28" ry="6" fill="#3c342b" opacity="0.12" />
			<ellipse cx="50" cy="60" rx="36" ry="24" fill="#e8c07a" stroke={stroke} stroke-width="3" />
			<ellipse cx="50" cy="50" rx="30" ry="16" fill="#f8ead2" stroke={stroke} stroke-width="2" />
			<path d="M30 50 Q50 38 70 50" fill="none" stroke="#c48955" stroke-width="3" stroke-linecap="round" />
			<ellipse cx="40" cy="48" rx="8" ry="5" fill="#fff6ea" />
		</svg>
	{:else if pic === 'milk'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<ellipse cx="50" cy="90" rx="20" ry="5" fill="#3c342b" opacity="0.12" />
			<path d="M34 28 L42 16 H58 L66 28 V84 H34 Z" fill="#fffaf2" stroke={stroke} stroke-width="3" stroke-linejoin="round" />
			<rect x="34" y="40" width="32" height="18" fill="#b9e3f7" />
			<circle cx="50" cy="49" r="6" fill="#fff" />
			<ellipse cx="42" cy="34" rx="6" ry="4" fill="#fff" />
		</svg>
	{:else if pic === 'shirt'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<ellipse cx="50" cy="90" rx="22" ry="5" fill="#3c342b" opacity="0.12" />
			<path
				d="M24 30 L40 20 L50 32 L60 20 L76 30 L68 42 V82 H32 V42 Z"
				fill="#3b6fd4"
				stroke={stroke}
				stroke-width="3"
				stroke-linejoin="round"
			/>
			<ellipse cx="40" cy="48" rx="8" ry="6" fill="#6e92e0" />
			<circle cx="50" cy="40" r="4" fill="#fffaf2" stroke={stroke} stroke-width="2" />
		</svg>
	{:else if pic === 'trousers'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<ellipse cx="50" cy="92" rx="22" ry="4" fill="#3c342b" opacity="0.12" />
			<path
				d="M30 16 H70 V46 L64 88 H52 L50 46 L48 88 H36 L30 46 Z"
				fill="#3b6fd4"
				stroke={stroke}
				stroke-width="3"
				stroke-linejoin="round"
			/>
			<rect x="30" y="16" width="40" height="10" fill="#2a58b5" />
		</svg>
	{:else if pic === 'hat'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<ellipse cx="50" cy="88" rx="30" ry="6" fill="#3c342b" opacity="0.12" />
			<ellipse cx="50" cy="70" rx="38" ry="11" fill="#8a5a3a" stroke={stroke} stroke-width="3" />
			<path d="M30 68 C32 30 68 30 70 68 Z" fill="#c48955" stroke={stroke} stroke-width="3" />
			<ellipse cx="44" cy="48" rx="8" ry="6" fill="#e8c07a" />
			<rect x="30" y="62" width="40" height="8" fill="#6ea85a" />
		</svg>
	{:else if pic === 'shoes'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<ellipse cx="50" cy="88" rx="30" ry="5" fill="#3c342b" opacity="0.12" />
			<path d="M14 62 H48 C62 62 64 76 48 78 H14 Z" fill="#3c342b" stroke={stroke} stroke-width="3" stroke-linejoin="round" />
			<path d="M50 46 H84 C98 46 100 60 84 62 H50 Z" fill="#3c342b" stroke={stroke} stroke-width="3" stroke-linejoin="round" />
			<ellipse cx="28" cy="66" rx="8" ry="4" fill="#6e5a4a" />
			<ellipse cx="64" cy="50" rx="8" ry="4" fill="#6e5a4a" />
		</svg>
	{:else if pic === 'ball'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<ellipse cx="50" cy="90" rx="24" ry="5" fill="#3c342b" opacity="0.12" />
			<circle cx="50" cy="50" r="32" fill="#e8883a" stroke={stroke} stroke-width="3" />
			<path d="M50 18 C38 40 38 60 50 82 M50 18 C62 40 62 60 50 82 M18 50 H82" fill="none" stroke="#fffaf2" stroke-width="3" />
			<ellipse cx="38" cy="38" rx="10" ry="7" fill="#f3b06a" />
		</svg>
	{:else if pic === 'blocks'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<ellipse cx="50" cy="90" rx="28" ry="5" fill="#3c342b" opacity="0.12" />
			<rect x="16" y="48" width="30" height="30" rx="6" fill="#ce2b37" stroke={stroke} stroke-width="3" />
			<rect x="38" y="28" width="30" height="30" rx="6" fill="#f2c84b" stroke={stroke} stroke-width="3" />
			<rect x="54" y="52" width="30" height="30" rx="6" fill="#3b6fd4" stroke={stroke} stroke-width="3" />
			<ellipse cx="26" cy="56" rx="6" ry="4" fill="#e8888a" />
			<ellipse cx="48" cy="36" rx="6" ry="4" fill="#ffe9a6" />
		</svg>
	{:else if pic === 'doll'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<ellipse cx="50" cy="92" rx="18" ry="4" fill="#3c342b" opacity="0.12" />
			<circle cx="50" cy="26" r="15" fill="#f4ead8" stroke={stroke} stroke-width="3" />
			<circle cx="45" cy="24" r="2.4" fill={stroke} />
			<circle cx="55" cy="24" r="2.4" fill={stroke} />
			<path d="M46 30 Q50 34 54 30" fill="none" stroke={stroke} stroke-width="2" stroke-linecap="round" />
			<path d="M38 18 Q50 8 62 18" fill="none" stroke="#7b5ea7" stroke-width="6" stroke-linecap="round" />
			<rect x="36" y="40" width="28" height="30" rx="10" fill="#7b5ea7" stroke={stroke} stroke-width="3" />
			<line x1="36" y1="50" x2="20" y2="64" stroke={stroke} stroke-width="5" stroke-linecap="round" />
			<line x1="64" y1="50" x2="80" y2="64" stroke={stroke} stroke-width="5" stroke-linecap="round" />
			<line x1="44" y1="68" x2="40" y2="88" stroke={stroke} stroke-width="5" stroke-linecap="round" />
			<line x1="56" y1="68" x2="60" y2="88" stroke={stroke} stroke-width="5" stroke-linecap="round" />
		</svg>
	{:else if pic === 'kite'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<polygon points="50,8 80,48 50,62 20,48" fill="#ce2b37" stroke={stroke} stroke-width="3" stroke-linejoin="round" />
			<polygon points="50,8 80,48 50,48" fill="#e8883a" />
			<line x1="50" y1="8" x2="50" y2="62" stroke={stroke} stroke-width="2" />
			<line x1="20" y1="48" x2="80" y2="48" stroke={stroke} stroke-width="2" />
			<path d="M50 62 L60 76 L44 82 L58 94" fill="none" stroke="#f2c84b" stroke-width="3" stroke-linecap="round" />
		</svg>
	{:else if pic === 'drum'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<ellipse cx="50" cy="90" rx="26" ry="5" fill="#3c342b" opacity="0.12" />
			<path d="M22 40 V64 C22 78 78 78 78 64 V40" fill="#ce2b37" stroke={stroke} stroke-width="3" />
			<ellipse cx="50" cy="40" rx="28" ry="13" fill="#fffaf2" stroke={stroke} stroke-width="3" />
			<line x1="30" y1="48" x2="30" y2="68" stroke="#f2c84b" stroke-width="3" />
			<line x1="70" y1="48" x2="70" y2="68" stroke="#f2c84b" stroke-width="3" />
			<line x1="70" y1="16" x2="80" y2="42" stroke="#8a5a3a" stroke-width="4" stroke-linecap="round" />
			<line x1="84" y1="14" x2="90" y2="40" stroke="#8a5a3a" stroke-width="4" stroke-linecap="round" />
		</svg>
	{:else if pic === 'piano'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<ellipse cx="50" cy="90" rx="30" ry="5" fill="#3c342b" opacity="0.12" />
			<rect x="12" y="26" width="76" height="52" rx="10" fill="#3c342b" stroke={stroke} stroke-width="3" />
			<rect x="18" y="48" width="9" height="24" fill="#fffaf2" />
			<rect x="29" y="48" width="9" height="24" fill="#fffaf2" />
			<rect x="40" y="48" width="9" height="24" fill="#fffaf2" />
			<rect x="51" y="48" width="9" height="24" fill="#fffaf2" />
			<rect x="62" y="48" width="9" height="24" fill="#fffaf2" />
			<rect x="73" y="48" width="9" height="24" fill="#fffaf2" />
			<rect x="25" y="48" width="6" height="15" fill="#1c1916" />
			<rect x="47" y="48" width="6" height="15" fill="#1c1916" />
			<rect x="58" y="48" width="6" height="15" fill="#1c1916" />
		</svg>
	{:else if pic === 'guitar'}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<ellipse cx="50" cy="90" rx="22" ry="5" fill="#3c342b" opacity="0.12" />
			<ellipse cx="42" cy="64" rx="24" ry="28" fill="#c48955" stroke={stroke} stroke-width="3" />
			<ellipse cx="38" cy="56" rx="8" ry="6" fill="#e8c07a" />
			<circle cx="42" cy="64" r="9" fill="#3c342b" />
			<circle cx="42" cy="64" r="4" fill="#8a5a3a" />
			<rect x="54" y="16" width="9" height="42" rx="4" fill="#8a5a3a" stroke={stroke} stroke-width="2" />
			<rect x="50" y="12" width="18" height="12" rx="3" fill="#e8c07a" stroke={stroke} stroke-width="2" />
		</svg>
	{:else}
		<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
			<ellipse cx="50" cy="88" rx="8" ry="4" fill="#3c342b" opacity="0.12" />
			<rect x="44" y="18" width="12" height="64" rx="6" fill="#e8c07a" stroke={stroke} stroke-width="3" />
			<circle cx="50" cy="18" r="8" fill="#ce2b37" stroke={stroke} stroke-width="2" />
			<circle cx="38" cy="40" r="4" fill="#fffaf2" stroke={stroke} stroke-width="2" />
			<circle cx="62" cy="52" r="4" fill="#fffaf2" stroke={stroke} stroke-width="2" />
			<circle cx="38" cy="64" r="4" fill="#fffaf2" stroke={stroke} stroke-width="2" />
		</svg>
	{/if}
</span>

<style>
	.pic {
		display: inline-grid;
		place-items: center;
	}
	.shadow :global(svg) {
		filter: brightness(0);
	}
</style>

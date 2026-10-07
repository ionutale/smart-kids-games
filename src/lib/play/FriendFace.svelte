<script lang="ts">
	import type { FriendArtId } from './types.ts';

	let { artId, size = 78 }: { artId: FriendArtId; size?: number } = $props();

	const colors: Record<FriendArtId, string> = {
		bird: '#f2c84b',
		cat: '#e8883a',
		dog: '#8a5a3a',
		rabbit: '#c8c2bc'
	};

	const body = $derived(colors[artId]);
	const stroke = '#3c342b';
	const cream = '#fff6ea';
	const cheek = '#efd3a3';
</script>

<svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
	{#if artId === 'bird'}
		<ellipse cx="50" cy="88" rx="22" ry="6" fill="#3c342b" opacity="0.12" />
		<ellipse cx="38" cy="80" rx="8" ry="5" fill="#e07a3d" stroke={stroke} stroke-width="2.5" />
		<ellipse cx="62" cy="80" rx="8" ry="5" fill="#e07a3d" stroke={stroke} stroke-width="2.5" />
		<ellipse cx="50" cy="56" rx="30" ry="28" fill={body} stroke={stroke} stroke-width="3" />
		<ellipse cx="26" cy="60" rx="13" ry="9" fill="#e8b83d" stroke={stroke} stroke-width="2.5" />
		<ellipse cx="38" cy="48" rx="10" ry="7" fill="#ffe9a6" />
		<ellipse cx="62" cy="52" rx="8" ry="7" fill={cheek} />
		<path d="M72 50 L92 56 L72 64 Z" fill="#e07a3d" stroke={stroke} stroke-width="2.5" stroke-linejoin="round" />
		<circle cx="60" cy="48" r="5.2" fill={stroke} />
		<circle cx="62" cy="46.4" r="1.8" fill="#fff" />
		<path d="M42 22 Q50 8 62 22" fill="none" stroke={body} stroke-width="6" stroke-linecap="round" />
		<path d="M42 22 Q50 8 62 22" fill="none" stroke={stroke} stroke-width="2.5" />
	{:else if artId === 'cat'}
		<ellipse cx="50" cy="90" rx="24" ry="5" fill="#3c342b" opacity="0.12" />
		<polygon points="20,42 32,8 44,40" fill={body} stroke={stroke} stroke-width="3" stroke-linejoin="round" />
		<polygon points="80,42 68,8 56,40" fill={body} stroke={stroke} stroke-width="3" stroke-linejoin="round" />
		<polygon points="26,34 32,14 40,36" fill={cream} />
		<polygon points="74,34 68,14 60,36" fill={cream} />
		<circle cx="50" cy="58" r="30" fill={body} stroke={stroke} stroke-width="3" />
		<ellipse cx="38" cy="50" rx="9" ry="6" fill="#f3b06a" />
		<ellipse cx="50" cy="72" rx="16" ry="11" fill={cream} />
		<circle cx="39" cy="52" r="5" fill={stroke} />
		<circle cx="61" cy="52" r="5" fill={stroke} />
		<circle cx="40.6" cy="50.4" r="1.7" fill="#fff" />
		<circle cx="62.6" cy="50.4" r="1.7" fill="#fff" />
		<path d="M50 62 L46 68 L54 68 Z" fill={stroke} />
		<path d="M50 68 Q50 74 46 76" fill="none" stroke={stroke} stroke-width="2" />
		<line x1="14" y1="58" x2="34" y2="62" stroke={stroke} stroke-width="2" stroke-linecap="round" />
		<line x1="16" y1="66" x2="34" y2="66" stroke={stroke} stroke-width="2" stroke-linecap="round" />
		<line x1="86" y1="58" x2="66" y2="62" stroke={stroke} stroke-width="2" stroke-linecap="round" />
		<line x1="84" y1="66" x2="66" y2="66" stroke={stroke} stroke-width="2" stroke-linecap="round" />
	{:else if artId === 'dog'}
		<ellipse cx="50" cy="90" rx="24" ry="5" fill="#3c342b" opacity="0.12" />
		<ellipse cx="22" cy="52" rx="11" ry="18" fill={body} stroke={stroke} stroke-width="3" />
		<ellipse cx="78" cy="56" rx="11" ry="16" fill="#6e452c" stroke={stroke} stroke-width="3" />
		<circle cx="50" cy="56" r="29" fill={body} stroke={stroke} stroke-width="3" />
		<ellipse cx="36" cy="50" rx="8" ry="6" fill="#c48955" />
		<ellipse cx="50" cy="70" rx="18" ry="13" fill="#f4ead8" stroke={stroke} stroke-width="2.5" />
		<ellipse cx="50" cy="76" rx="9" ry="7" fill={stroke} />
		<circle cx="39" cy="50" r="5" fill={stroke} />
		<circle cx="61" cy="50" r="5" fill={stroke} />
		<circle cx="40.6" cy="48.4" r="1.7" fill="#fff" />
		<circle cx="62.6" cy="48.4" r="1.7" fill="#fff" />
		<circle cx="64" cy="64" r="6" fill="#6e452c" />
	{:else}
		<ellipse cx="50" cy="90" rx="22" ry="5" fill="#3c342b" opacity="0.12" />
		<ellipse cx="28" cy="24" rx="9" ry="22" fill={body} stroke={stroke} stroke-width="3" />
		<ellipse cx="72" cy="24" rx="9" ry="22" fill={body} stroke={stroke} stroke-width="3" />
		<ellipse cx="28" cy="24" rx="4.5" ry="14" fill={cream} />
		<ellipse cx="72" cy="24" rx="4.5" ry="14" fill={cream} />
		<circle cx="50" cy="60" r="29" fill={body} stroke={stroke} stroke-width="3" />
		<ellipse cx="38" cy="54" rx="8" ry="6" fill="#ddd8d2" />
		<ellipse cx="50" cy="74" rx="15" ry="11" fill={cream} />
		<circle cx="39" cy="54" r="5" fill={stroke} />
		<circle cx="61" cy="54" r="5" fill={stroke} />
		<circle cx="40.6" cy="52.4" r="1.7" fill="#fff" />
		<circle cx="62.6" cy="52.4" r="1.7" fill="#fff" />
		<ellipse cx="50" cy="66" rx="4.5" ry="3.2" fill="#8a5a3a" />
	{/if}
</svg>

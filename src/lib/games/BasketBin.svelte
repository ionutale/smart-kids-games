<script lang="ts">
	let { size = 120 }: { size?: number } = $props();
	const stroke = '#3c342b';
</script>

<svg class="bin" viewBox="0 0 88 72" width={size} height={size * 0.82} aria-hidden="true">
	<path d="M12 24 L20 68 H68 L76 24 Z" fill="#c48955" stroke={stroke} stroke-width="3" stroke-linejoin="round" />
	<path d="M8 20 H80 L74 30 H14 Z" fill="#e8a05a" stroke={stroke} stroke-width="3" stroke-linejoin="round" />
	<ellipse cx="44" cy="24" rx="28" ry="6" fill="#fff6ea" stroke={stroke} stroke-width="2" />
</svg>

<style>
	.bin {
		display: block;
		overflow: visible;
	}
</style>

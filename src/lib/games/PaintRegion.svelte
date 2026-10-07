<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		index,
		glow = false,
		family = '',
		children,
		onPick
	}: {
		index: number;
		glow?: boolean;
		family?: string;
		children: Snippet;
		onPick: (index: number) => void;
	} = $props();

	function onKey(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onPick(index);
		}
	}
</script>

<g
	role="button"
	tabindex="0"
	aria-label="region {index + 1}"
	data-testid="region-{index + 1}"
	data-drop="paint-{index}"
	data-family={family}
	class:glow
	onclick={() => onPick(index)}
	onkeydown={onKey}
>
	{@render children()}
</g>

<style>
	g {
		cursor: pointer;
	}
	.glow {
		filter: drop-shadow(0 0 0 #fff) drop-shadow(0 0 6px #f0c14a);
	}
</style>

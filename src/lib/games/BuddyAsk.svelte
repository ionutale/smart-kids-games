<script lang="ts">
	import FriendFace from '../play/FriendFace.svelte';
	import type { FriendArtId } from '../play/types.ts';
	import type { Snippet } from 'svelte';

	let {
		artId,
		mood = 'idle',
		hearLabel,
		hearTestId = 'buddy-hear',
		listen = true,
		onHear,
		children
	}: {
		artId: FriendArtId;
		mood?: 'idle' | 'happy' | 'sad';
		hearLabel: string;
		hearTestId?: string;
		listen?: boolean;
		onHear: () => void;
		children?: Snippet;
	} = $props();
</script>

<div class="buddy" data-testid="buddy" data-mood={mood}>
	<div class="pal" class:hop={mood === 'happy'} class:wobble={mood === 'sad'}>
		<FriendFace {artId} size={100} />
	</div>
	{#if listen}
		<button type="button" class="ask" data-testid={hearTestId} aria-label={hearLabel} onclick={onHear}>
			{@render children?.()}
		</button>
	{:else}
		<div class="ask" data-testid="buddy-ask">
			{@render children?.()}
		</div>
	{/if}
</div>

<style>
	.buddy {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		margin: 0 auto 8px;
		width: 100%;
	}
	.pal {
		filter: drop-shadow(0 8px 0 rgba(60, 52, 43, 0.12));
	}
	.pal.hop {
		animation: hop 0.55s ease;
	}
	.pal.wobble {
		animation: wobble 0.45s ease;
	}
	.ask {
		position: relative;
		min-width: 88px;
		min-height: 88px;
		padding: 10px 14px;
		border: 0;
		border-radius: 28px;
		background: linear-gradient(#fffdf8, #fff6ea);
		box-shadow: 0 8px 0 #c9a66b;
		display: grid;
		place-items: center;
		cursor: pointer;
		font: inherit;
		color: inherit;
	}
	.ask::after {
		content: '';
		position: absolute;
		left: -12px;
		top: 36px;
		border: 10px solid transparent;
		border-right-color: #fff6ea;
	}
	@keyframes hop {
		0%,
		100% {
			transform: translateY(0);
		}
		40% {
			transform: translateY(-14px) scale(1.08);
		}
	}
	@keyframes wobble {
		25% {
			transform: rotate(-12deg);
		}
		75% {
			transform: rotate(12deg);
		}
	}
</style>

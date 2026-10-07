<script lang="ts">
	import FriendFace from './FriendFace.svelte';
	import { playSfx } from './sfx.ts';
	import type { CheerKind } from './stars.ts';
	import type { FriendArtId } from './types.ts';

	let { kind, artId }: { kind: CheerKind; artId: FriendArtId } = $props();

	$effect(() => {
		kind;
		playSfx('success');
	});
</script>

<div class="cheer" data-testid="cheer" data-cheer={kind} aria-hidden="true">
	<div class="burst">
		{#each Array(10) as _, i}
			<i class="spark" class:halo={kind === 'all'} style="--i: {i}"></i>
		{/each}
		<span class="prize" class:full={kind === 'all'}></span>
		<div class="pal">
			<FriendFace {artId} size={108} />
		</div>
	</div>
</div>

<style>
	.cheer {
		position: fixed;
		inset: 0;
		z-index: 8;
		display: grid;
		place-items: center;
		pointer-events: none;
		background: radial-gradient(circle at 50% 42%, rgba(255, 246, 210, 0.72) 0 18%, transparent 52%);
		animation: fade 3.8s ease forwards;
	}
	.burst {
		position: relative;
		width: 240px;
		height: 260px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 6px;
	}
	.prize {
		width: 108px;
		height: 108px;
		background: #f0c14a;
		clip-path: polygon(50% 2%, 63% 35%, 98% 38%, 70% 59%, 79% 93%, 50% 74%, 21% 93%, 30% 59%, 2% 38%, 37% 35%);
		filter: drop-shadow(0 0 18px #ffe08a);
		animation: pop 0.7s ease;
		z-index: 1;
	}
	.prize.full {
		background: #ffd24a;
		filter: drop-shadow(0 0 26px #fff3b0);
	}
	.pal {
		animation: hop 0.7s ease 0.12s both;
		z-index: 2;
		filter: drop-shadow(0 8px 0 rgba(60, 52, 43, 0.12));
	}
	.spark {
		position: absolute;
		left: 50%;
		top: 42%;
		width: 22px;
		height: 22px;
		margin: -11px;
		background: #ffe08a;
		clip-path: polygon(50% 2%, 63% 35%, 98% 38%, 70% 59%, 79% 93%, 50% 74%, 21% 93%, 30% 59%, 2% 38%, 37% 35%);
		transform: rotate(calc(var(--i) * 36deg)) translateY(-96px);
		animation: spark 1.4s ease calc(var(--i) * 40ms) both;
	}
	.spark.halo {
		background: #fff6c8;
		transform: rotate(calc(var(--i) * 36deg)) translateY(-110px) scale(1.2);
	}
	@keyframes pop {
		0% {
			transform: scale(0.15) rotate(-24deg);
		}
		58% {
			transform: scale(1.35) rotate(12deg);
		}
		100% {
			transform: scale(1);
		}
	}
	@keyframes hop {
		0% {
			transform: translateY(18px) scale(0.7);
			opacity: 0;
		}
		100% {
			transform: translateY(0) scale(1);
			opacity: 1;
		}
	}
	@keyframes spark {
		0% {
			opacity: 0;
			filter: brightness(1.4);
		}
		35% {
			opacity: 1;
		}
		100% {
			opacity: 0.55;
		}
	}
	@keyframes fade {
		0%,
		78% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
</style>

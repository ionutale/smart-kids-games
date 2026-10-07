<script lang="ts">
	import GameBoard from '#lib/games/GameBoard.svelte';
	import CottagePic from '#lib/play/CottagePic.svelte';
	import StarCheer from '#lib/play/StarCheer.svelte';
	import {
		ALL_STARS_VOICE,
		CATEGORY_PROMPT,
		FASTER_VOICE,
		GAME_NAME,
		ODD_PROMPT,
		PATH_PROMPT,
		STAR_VOICE,
		SORT_PROMPT,
		WEATHER_PROMPT
	} from '#lib/play/language.ts';
	import { cheerKind } from '#lib/play/stars.ts';
	import { speak } from '#lib/play/voice.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let started = $state(Date.now());
	let finishing = $state(false);
	let finishForm = $state<HTMLFormElement | undefined>();
	const cheer = $derived(cheerKind(data.firstFinish, data.stars));

	$effect(() => {
		data.game;
		data.level;
		started = Date.now();
		finishing = false;
		if (cheer === 'all') speak(ALL_STARS_VOICE[data.language], data.language);
		else if (cheer === 'star') speak(STAR_VOICE[data.language], data.language);
		else if (data.faster) speak(FASTER_VOICE[data.language], data.language);
		else if (data.game === 'odd-one-out') speak(ODD_PROMPT[data.language], data.language);
		else if (data.game === 'path') speak(PATH_PROMPT[data.language], data.language);
		else if (data.game === 'weather') speak(WEATHER_PROMPT[data.language], data.language);
		else if (data.game === 'categories') speak(CATEGORY_PROMPT[data.language], data.language);
		else if (data.game === 'sorting') speak(SORT_PROMPT[data.language], data.language);
		else if (data.game !== 'sound-safari') speak(GAME_NAME[data.game][data.language], data.language);
	});

	function finish() {
		if (finishing || data.free || !finishForm) return;
		finishing = true;
		const time = finishForm.elements.namedItem('timeMs') as HTMLInputElement;
		time.value = String(Date.now() - started);
		finishForm.requestSubmit();
	}
</script>

<div
	class="play"
	data-testid="play"
	data-game={data.game}
	data-level={data.level}
	data-cheer={cheer ?? undefined}
>
	<a class="back" href="/" data-testid="back">←</a>
	<div class="icon"><CottagePic game={data.game} size={80} /></div>
	{#if !data.free}
		<div class="stars">
			{#each data.stars as on, i}
				{#if on}
					<a
						class="star on"
						class:pop={cheer && i + 1 === data.done}
						class:wiggle={data.faster && i + 1 === data.done}
						href="/play/{data.game}?level={i + 1}"
						aria-label="level {i + 1}"
					></a>
				{:else}
					<i class="star" class:next={i + 1 === data.next}></i>
				{/if}
			{/each}
		</div>
	{/if}
	{#if data.game === 'paint'}
		<a class="free" href="/play/paint?free=1" data-testid="free-style" aria-label="free style">✎</a>
	{/if}
	<GameBoard
		game={data.game}
		level={data.level}
		language={data.language}
		artId={data.artId}
		free={data.free}
		onFinished={finish}
	/>
	<form bind:this={finishForm} method="POST" action="?/finish" data-testid="finish-form">
		<input type="hidden" name="level" value={data.level} />
		<input type="hidden" name="timeMs" value="1" />
	</form>
	{#if cheer}
		<StarCheer kind={cheer} artId={data.artId} />
	{/if}
</div>

<style>
	.play {
		min-height: 100vh;
		background:
			radial-gradient(ellipse at 50% -8%, #ffd9a0 0 22%, transparent 52%),
			linear-gradient(#f8e2bc 0%, #efd3a3 46%, #d5e4a4 72%, #9fb56a 100%);
		padding: 16px 16px 64px;
		position: relative;
		font-family: Nunito, 'Avenir Next', 'Segoe UI', sans-serif;
		color: #3c342b;
		box-shadow: inset 0 0 90px rgba(120, 70, 30, 0.1);
	}
	.play::before {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 72px;
		pointer-events: none;
		background: radial-gradient(ellipse at 50% 120%, #7a9a55 0 58%, transparent 59%);
		z-index: 0;
	}
	.play::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0.06;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
	}
	.back,
	.free {
		position: absolute;
		top: 16px;
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background: linear-gradient(#fff8ea, #f3e0ba);
		display: grid;
		place-items: center;
		text-decoration: none;
		color: inherit;
		font-size: 28px;
		box-shadow: 0 6px 0 #c9a66b;
		z-index: 1;
	}
	.back {
		left: 16px;
	}
	.free {
		right: 16px;
	}
	.icon {
		display: grid;
		place-items: center;
		margin-top: 12px;
	}
	.stars {
		display: flex;
		justify-content: center;
		gap: 6px;
		margin: 8px 0 18px;
	}
	.star {
		width: 22px;
		height: 22px;
		background: #e4d3b0;
		display: block;
		clip-path: polygon(50% 2%, 63% 35%, 98% 38%, 70% 59%, 79% 93%, 50% 74%, 21% 93%, 30% 59%, 2% 38%, 37% 35%);
	}
	.star.on {
		background: #f0c14a;
		filter: drop-shadow(0 0 4px #ffe08a);
	}
	.star.next {
		box-shadow: 0 0 0 3px #fff, 0 0 0 5px #f0c14a;
	}
	.wiggle {
		animation: wiggle 0.4s ease-in-out 3;
	}
	.pop {
		animation: pop 0.7s ease;
	}
	@keyframes wiggle {
		50% {
			transform: rotate(-18deg) scale(1.2);
		}
	}
	@keyframes pop {
		0% {
			transform: scale(0.2) rotate(-20deg);
		}
		60% {
			transform: scale(1.55) rotate(12deg);
		}
		100% {
			transform: scale(1);
		}
	}
</style>

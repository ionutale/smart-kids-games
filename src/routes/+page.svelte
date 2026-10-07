<script lang="ts">
	import FriendFace from '#lib/play/FriendFace.svelte';
	import CottagePic from '#lib/play/CottagePic.svelte';
	import { FRIEND_ART_IDS, type FriendArtId } from '#lib/play/types.ts';
	import { GAME_NAME, LANGUAGE_NAME, PICK_FRIEND } from '#lib/play/language.ts';
	import { rowComplete } from '#lib/play/stars.ts';
	import { NAMES } from '#lib/play/pictures.ts';
	import { LONG_PRESS_MS } from '#lib/play/slots.ts';
	import { SFX } from '#lib/play/sfx.ts';
	import { speak } from '#lib/play/voice.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let picking = $state(false);
	let erasingId = $state<string | null>(null);
	let hold = $state<ReturnType<typeof setTimeout> | null>(null);
	const needsFriend = $derived(data.noticeSeen && !data.activeId);

	function clearHold() {
		if (hold) clearTimeout(hold);
		hold = null;
	}

	function openPicker() {
		if (!data.noticeSeen) return;
		picking = true;
		speak(PICK_FRIEND[data.language], data.language);
	}

	function onNestPointerDown(slotId: string | undefined) {
		if (!slotId) return;
		clearHold();
		hold = setTimeout(() => {
			erasingId = slotId;
			hold = null;
		}, LONG_PRESS_MS);
	}

	$effect(() => {
		if (!needsFriend) return;
		if (typeof navigator !== 'undefined' && navigator.webdriver) return;
		speak(PICK_FRIEND[data.language], data.language);
	});

	$effect(() => {
		if (!data.noticeSeen) return;
		if (typeof navigator !== 'undefined' && navigator.webdriver) return;
		const loop = new Audio(SFX.home);
		loop.loop = true;
		loop.volume = 0.22;
		loop.play().catch(() => {});
		return () => {
			loop.pause();
		};
	});
</script>


<div class="meadow" data-testid="meadow">
	<div class="sun" data-testid="sun"></div>
	<div class="cloud one" aria-hidden="true"></div>
	<div class="cloud two" aria-hidden="true"></div>
	<div class="sky-row">
		<div class="nests">
			{#each data.nests as nest, i (nest?.id ?? `empty-${i}`)}
				{#if nest}
					<form method="POST" action="?/activate">
						<input type="hidden" name="slotId" value={nest.id} />
						<button
							class="slot filled"
							class:active={data.activeId === nest.id}
							data-testid="nest-{i + 1}"
							aria-label="Picture slot {i + 1}"
							onpointerdown={() => onNestPointerDown(nest.id)}
							onpointerup={clearHold}
							onpointerleave={clearHold}
							onpointercancel={clearHold}
							onclick={(event) => {
								if (erasingId) event.preventDefault();
								else speak(NAMES[nest.artId][data.language], data.language);
							}}
						>
							<FriendFace artId={nest.artId} />
						</button>
					</form>
				{:else}
					<button
						type="button"
						class="slot"
						class:need={needsFriend && i === 0}
						data-testid="nest-{i + 1}"
						aria-label={needsFriend && i === 0 ? PICK_FRIEND[data.language] : `Picture slot ${i + 1}`}
						disabled={!data.noticeSeen}
						onclick={() => openPicker()}
					>
						{#if needsFriend && i === 0}
							<span class="peek" aria-hidden="true">
								{#each FRIEND_ART_IDS as artId}
									<FriendFace artId={artId as FriendArtId} size={28} />
								{/each}
							</span>
							<svg class="tap-hint" viewBox="0 0 48 48" width="34" height="34" aria-hidden="true">
								<ellipse cx="28" cy="38" rx="10" ry="6" fill="#f4c7a5" stroke="#3c342b" stroke-width="2" />
								<path
									d="M22 36 L22 16 C22 12 28 12 28 16 L28 22 L30 10 C30 7 34 7 34 11 L34 22 L36 14 C36 11 40 11 40 15 L40 28 C40 36 34 40 26 40 L22 36 Z"
									fill="#f4c7a5"
									stroke="#3c342b"
									stroke-width="2"
								/>
							</svg>
						{/if}
					</button>
				{/if}
			{/each}
			</div>
			{#if needsFriend}
				<button
					type="button"
					class="pick-hint"
					data-testid="pick-friend"
					aria-label={PICK_FRIEND[data.language]}
					onclick={() => openPicker()}
				>
					{#each FRIEND_ART_IDS as artId}
						<FriendFace artId={artId as FriendArtId} size={48} />
					{/each}
				</button>
			{/if}
			<div class="home-links">
				<div class="flags">
					<form method="POST" action="?/language">
						<input type="hidden" name="language" value="it" />
						<button
							class="flag"
							class:on={data.language === 'it'}
							data-testid="flag-it"
							aria-label={LANGUAGE_NAME.it}
							onclick={() => speak(LANGUAGE_NAME.it, 'it')}
						>
							<span class="it"><i></i><i></i><i></i></span>
						</button>
					</form>
					<form method="POST" action="?/language">
						<input type="hidden" name="language" value="en" />
						<button
							class="flag"
							class:on={data.language === 'en'}
							data-testid="flag-en"
							aria-label={LANGUAGE_NAME.en}
							onclick={() => speak(LANGUAGE_NAME.en, 'en')}
						>
							<span class="uk" aria-hidden="true">
								<svg viewBox="0 0 60 30" width="64" height="44">
									<rect width="60" height="30" fill="#012169" />
									<path d="M0 0 L60 30 M60 0 L0 30" stroke="#fff" stroke-width="6" />
									<path d="M0 0 L60 30" stroke="#c8102e" stroke-width="2" />
									<path d="M60 0 L0 30" stroke="#c8102e" stroke-width="2" />
									<path d="M30 0 V30 M0 15 H60" stroke="#fff" stroke-width="10" />
									<path d="M30 0 V30 M0 15 H60" stroke="#c8102e" stroke-width="6" />
								</svg>
							</span>
						</button>
					</form>
				</div>
				{#if data.noticeSeen}
					<a class="leaf" href="/?pictures=1" data-testid="leaf" aria-label="How we remember play">
						<svg viewBox="0 0 64 64" width="42" height="42" aria-hidden="true">
							<path
								d="M12 36 C18 8 50 6 52 32 C34 22 22 28 12 36 Z"
								fill="#6ea85a"
								stroke="#3c342b"
								stroke-width="2"
							/>
							<path d="M20 40 C28 24 40 18 50 30" fill="none" stroke="#3c342b" stroke-width="2" />
						</svg>
					</a>
					<a class="grownups" href="/notice" data-testid="grownups">For grown-ups</a>
				{/if}
			</div>
	</div>
	<div class="breeze" aria-hidden="true">
		<span class="fly one"><FriendFace artId="bird" size={32} /></span>
		<span class="fly two"><FriendFace artId="bird" size={24} /></span>
	</div>
	<div class="hills" aria-hidden="true">
		<svg viewBox="0 0 1200 220" preserveAspectRatio="none">
			<path d="M0 118 C140 48 240 158 380 96 C520 34 640 148 800 88 C960 28 1080 138 1200 78 V220 H0 Z" fill="#c5d48a" />
			<path d="M0 154 C180 98 300 188 480 138 C660 88 820 178 980 128 C1100 96 1160 154 1200 138 V220 H0 Z" fill="#9fb56a" />
			<path d="M0 188 C200 158 400 208 600 176 C800 144 1000 202 1200 172 V220 H0 Z" fill="#7a9a55" />
			<path d="M0 206 C260 196 520 214 780 200 C980 190 1100 208 1200 202 V220 H0 Z" fill="#c4a574" opacity="0.55" />
			<g fill="#f0c14a">
				<circle cx="90" cy="168" r="4" />
				<circle cx="210" cy="154" r="3.5" />
				<circle cx="340" cy="176" r="4" />
				<circle cx="520" cy="160" r="3.2" />
				<circle cx="710" cy="172" r="4" />
				<circle cx="880" cy="150" r="3.4" />
				<circle cx="1040" cy="168" r="3.8" />
			</g>
			<g fill="#fff6ea">
				<circle cx="94" cy="166" r="1.6" />
				<circle cx="214" cy="152" r="1.4" />
				<circle cx="344" cy="174" r="1.6" />
				<circle cx="524" cy="158" r="1.3" />
				<circle cx="714" cy="170" r="1.6" />
				<circle cx="884" cy="148" r="1.4" />
				<circle cx="1044" cy="166" r="1.5" />
			</g>
		</svg>
	</div>
	<div class="lane" data-testid="games">
		{#each data.cottages as cottage (cottage.id)}
			{#if data.activeId}
				<a
					class="cottage"
					class:complete={rowComplete(cottage.stars)}
					href="/play/{cottage.id}"
					data-testid="cottage-{cottage.id}"
					data-complete={rowComplete(cottage.stars) ? '1' : '0'}
					aria-label={GAME_NAME[cottage.id][data.language]}
				>
					<span class="roof" aria-hidden="true"></span>
					<span class="wall">
						<div class="icon"><CottagePic game={cottage.id} size={80} /></div>
						<span class="gname">{GAME_NAME[cottage.id][data.language]}</span>
						<div class="stars">
							{#each cottage.stars as on}
								<i class="star" class:on></i>
							{/each}
						</div>
					</span>
				</a>
			{:else}
				<button
					type="button"
					class="cottage inactive"
					class:complete={rowComplete(cottage.stars)}
					data-testid="cottage-{cottage.id}"
					data-complete={rowComplete(cottage.stars) ? '1' : '0'}
					aria-label={PICK_FRIEND[data.language]}
					onclick={() => openPicker()}
				>
					<span class="roof" aria-hidden="true"></span>
					<span class="wall">
						<div class="icon"><CottagePic game={cottage.id} size={80} /></div>
						<span class="gname">{GAME_NAME[cottage.id][data.language]}</span>
						<div class="stars">
							{#each cottage.stars as on}
								<i class="star" class:on></i>
							{/each}
						</div>
					</span>
				</button>
			{/if}
		{/each}
	</div>
</div>

{#if picking}
	<div class="sheet" data-testid="picker">
		<div class="panel">
			{#each FRIEND_ART_IDS as artId (artId)}
				<form method="POST" action="?/create">
					<input type="hidden" name="artId" value={artId} />
					<button
						class="choice"
						data-testid="friend-{artId}"
						aria-label={NAMES[artId][data.language]}
						onclick={() => speak(NAMES[artId][data.language], data.language)}
					>
						<FriendFace artId={artId as FriendArtId} size={96} />
					</button>
				</form>
			{/each}
			<button type="button" class="close" onclick={() => (picking = false)}>✕</button>
		</div>
	</div>
{/if}

{#if erasingId}
	<div class="confirm">
		<div class="panel">
			<p class="hint" aria-hidden="true">
				<svg viewBox="0 0 80 80" width="72" height="72">
					<circle cx="40" cy="40" r="28" fill="#6ea85a" />
					<path d="M22 28 L58 52" stroke="#3c342b" stroke-width="6" />
				</svg>
			</p>
			<div class="row">
				<form method="POST" action="?/erase">
					<input type="hidden" name="slotId" value={erasingId} />
					<button class="yes" data-testid="confirm-erase" aria-label="Confirm erase">✓</button>
				</form>
				<button type="button" class="no" data-testid="keep-slot" aria-label="Keep picture slot" onclick={() => (erasingId = null)}>✕</button>
			</div>
		</div>
	</div>
{/if}

{#if !data.noticeSeen || data.showPictures}
	<div class="notice" data-testid="notice">
		<div class="steps">
			<figure data-testid="notice-hold">
				<svg viewBox="0 0 120 120" aria-hidden="true">
					<circle cx="48" cy="52" r="26" fill="#fff" stroke="#3c342b" stroke-width="3" />
					<ellipse cx="48" cy="58" rx="16" ry="14" fill="#f2c84b" stroke="#3c342b" stroke-width="2" />
					<path d="M60 54 L72 58 L60 62 Z" fill="#e07a3d" />
					<circle cx="54" cy="52" r="2.4" fill="#3c342b" />
					<circle cx="48" cy="52" r="34" fill="none" stroke="#f0c14a" stroke-width="3" opacity="0.7" />
					<path
						d="M78 88 C78 70 92 66 96 78 C100 70 110 74 108 86 C112 92 102 104 90 104 C78 104 74 96 78 88 Z"
						fill="#f4ead8"
						stroke="#3c342b"
						stroke-width="3"
					/>
					<rect x="88" y="64" width="10" height="22" rx="5" fill="#f4ead8" stroke="#3c342b" stroke-width="3" />
				</svg>
			</figure>
			<figure data-testid="notice-confirm">
				<svg viewBox="0 0 120 120" aria-hidden="true">
					<rect x="18" y="28" width="84" height="64" rx="18" fill="#d8f0c8" stroke="#3c342b" stroke-width="3" />
					<circle cx="60" cy="60" r="18" fill="#6ea85a" />
					<path d="M50 60 l8 8 14-16" fill="none" stroke="#fffaf2" stroke-width="5" stroke-linecap="round" />
				</svg>
			</figure>
			<figure data-testid="notice-gone">
				<svg viewBox="0 0 120 120" aria-hidden="true">
					<circle cx="60" cy="60" r="28" fill="#6ea85a" stroke="#3c342b" stroke-width="3" stroke-dasharray="7 6" />
					<path d="M44 48 L76 80 M76 48 L44 80" stroke="#3c342b" stroke-width="5" stroke-linecap="round" />
				</svg>
			</figure>
		</div>
		<div class="notice-actions">
			{#if !data.noticeSeen}
				<form method="POST" action="?/go">
					<button class="go" aria-label="Go" data-testid="go">Go</button>
				</form>
			{:else}
				<a class="go" href="/" aria-label="Go" data-testid="go">Go</a>
			{/if}
			<a class="book" href="/notice" aria-label="Written notice">
				<svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
					<rect x="10" y="12" width="44" height="40" rx="6" fill="#fffaf2" stroke="#3c342b" stroke-width="3" />
					<path d="M32 12 v40" stroke="#c48955" stroke-width="3" />
				</svg>
			</a>
		</div>
	</div>
{/if}

<style>
	:global(html, body) {
		margin: 0;
		min-height: 100%;
		font-family: Nunito, 'Avenir Next', 'Segoe UI', sans-serif;
		color: #3c342b;
		background: #1c1916;
	}
	button,
	a {
		font: inherit;
		color: inherit;
	}
	button {
		border: 0;
		background: none;
		cursor: pointer;
	}
	button:focus-visible,
	a:focus-visible {
		outline: 3px solid #2f6fed;
		outline-offset: 3px;
	}
	.meadow {
		min-height: 100vh;
		background:
			radial-gradient(ellipse at 50% 10%, #ffe7b0 0 10%, transparent 32%),
			linear-gradient(#f3c4a0 0%, #f8d7b0 18%, #f6e4c4 42%, #e3ecc0 68%, #b7c882 100%);
		position: relative;
		overflow: hidden;
	}
	.meadow::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 4;
		opacity: 0.08;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
	}
	.sun {
		position: absolute;
		left: 50%;
		top: 22px;
		width: 92px;
		height: 92px;
		background: radial-gradient(circle at 34% 32%, #fff8d8, #ffd27a 50%, #e8a24a);
		border-radius: 50%;
		transform: translateX(-50%);
		z-index: 0;
		box-shadow:
			0 0 0 18px rgba(255, 210, 130, 0.32),
			0 0 70px 28px rgba(232, 140, 70, 0.28);
		animation: sun-pulse 7s ease-in-out infinite;
	}
	.cloud {
		position: absolute;
		background: #fff4e4;
		border-radius: 40px;
		opacity: 0.78;
		pointer-events: none;
		z-index: 0;
	}
	.cloud.one {
		width: 92px;
		height: 28px;
		left: 32%;
		top: 22px;
	}
	.cloud.one::before,
	.cloud.one::after,
	.cloud.two::before,
	.cloud.two::after {
		content: '';
		position: absolute;
		background: #fff4e4;
		border-radius: 50%;
	}
	.cloud.one::before {
		width: 36px;
		height: 36px;
		left: 16px;
		top: -18px;
	}
	.cloud.one::after {
		width: 46px;
		height: 46px;
		left: 40px;
		top: -24px;
	}
	.cloud.two {
		width: 70px;
		height: 22px;
		left: 58%;
		top: 48px;
	}
	.cloud.two::before {
		width: 28px;
		height: 28px;
		left: 10px;
		top: -14px;
	}
	.cloud.two::after {
		width: 36px;
		height: 36px;
		left: 30px;
		top: -18px;
	}
	.hills {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 34vh;
		min-height: 160px;
		z-index: 0;
		pointer-events: none;
	}
	.hills svg {
		display: block;
		width: 100%;
		height: 100%;
	}
	.breeze {
		position: relative;
		height: 44px;
		overflow: hidden;
		pointer-events: none;
		z-index: 0;
	}
	.breeze :global(*) {
		pointer-events: none;
	}
	.fly {
		position: absolute;
		top: 6px;
		left: 0;
		animation: breeze-fly 24s linear infinite;
	}
	.fly.two {
		top: 16px;
		opacity: 0.75;
		animation-duration: 31s;
		animation-delay: -11s;
	}
	.sky-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		flex-wrap: wrap;
		padding: 22px 22px 0;
		gap: 16px;
		position: relative;
		z-index: 1;
	}
	.nests {
		display: flex;
		gap: 14px;
	}
	.slot {
		width: 86px;
		height: 86px;
		border-radius: 50%;
		background:
			radial-gradient(circle at 50% 42%, #e7f0c8 0 34%, #b7c882 36% 62%, #8fa85a 64%);
		border: 8px solid #8a5a3a;
		box-shadow:
			inset 0 -10px 0 rgba(60, 52, 43, 0.12),
			0 6px 0 #7a9a55;
		display: grid;
		place-items: center;
		position: relative;
	}
	.slot.need {
		animation: nest-pulse 1.15s ease-in-out infinite;
		z-index: 2;
	}
	.peek {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0;
		width: 58px;
		pointer-events: none;
	}
	.tap-hint {
		position: absolute;
		right: -16px;
		bottom: -10px;
		pointer-events: none;
		filter: drop-shadow(0 2px 0 rgba(60, 52, 43, 0.2));
		animation: tap-bob 0.9s ease-in-out infinite;
	}
	.pick-hint {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 8px 12px;
		border-radius: 28px;
		background: linear-gradient(#fff8ea, #f3e0ba);
		box-shadow:
			0 0 0 4px #fff,
			0 0 0 8px #f0c14a,
			0 6px 0 #c9a66b;
		animation: nest-pulse 1.15s ease-in-out infinite;
		z-index: 2;
	}
	.slot.filled {
		border-style: solid;
		border-color: #8a5a3a;
		background:
			radial-gradient(circle at 50% 40%, #fff6ea 0 44%, #e8c07a 46% 70%, #c48955 72%);
	}
	.slot.active {
		box-shadow:
			0 0 0 4px #fff,
			0 0 0 8px #f0c14a;
	}
	.home-links {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.flags {
		display: flex;
		gap: 10px;
	}
	.flag {
		width: 64px;
		height: 44px;
		border-radius: 10px;
		overflow: hidden;
		opacity: 0.55;
		padding: 0;
	}
	.flag.on {
		opacity: 1;
		transform: translateY(-4px);
		box-shadow: 0 0 0 4px #fff, 0 6px 0 rgba(0, 0, 0, 0.08);
	}
	.flag .it,
	.flag .uk {
		display: flex;
		height: 100%;
	}
	.flag .it i {
		flex: 1;
		display: block;
	}
	.flag .it i:nth-child(1) {
		background: #009246;
	}
	.flag .it i:nth-child(2) {
		background: #fff;
	}
	.flag .it i:nth-child(3) {
		background: #ce2b37;
	}
	.flag .uk {
		display: block;
		width: 100%;
		height: 100%;
	}
	.flag .uk svg {
		display: block;
		width: 100%;
		height: 100%;
	}
	.lane {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(148px, 100%), 1fr));
		gap: 20px 18px;
		padding: 18px 28px 140px;
		max-width: 1080px;
		margin: 0 auto;
		width: 100%;
		box-sizing: border-box;
		position: relative;
		z-index: 1;
	}
	.cottage {
		display: flex;
		flex-direction: column;
		background: none;
		padding: 0;
		text-align: center;
		text-decoration: none;
		color: inherit;
		min-width: 0;
		position: relative;
		filter: drop-shadow(0 9px 0 #7a9a55);
		transition: transform 0.18s ease;
	}
	.cottage:hover {
		filter: drop-shadow(0 12px 0 #6a8a48);
	}
	.cottage.complete {
		filter: drop-shadow(0 9px 0 #7a9a55) drop-shadow(0 0 10px #ffe08a);
	}
	.cottage.complete:hover {
		filter: drop-shadow(0 12px 0 #6a8a48) drop-shadow(0 0 10px #ffe08a);
	}
	.cottage.complete .roof {
		background: linear-gradient(#f0c14a, #e07a3d);
	}
	.cottage.complete .star.on {
		animation: twinkle 1.8s ease-in-out infinite;
	}
	.cottage.complete .star.on:nth-child(2n) {
		animation-delay: 0.3s;
	}
	.cottage.complete .star.on:nth-child(3n) {
		animation-delay: 0.6s;
	}
	@keyframes twinkle {
		50% {
			filter: drop-shadow(0 0 7px #fff3b0);
			background: #ffe08a;
		}
	}
	.cottage.inactive {
		opacity: 0.72;
		cursor: pointer;
		filter: drop-shadow(0 9px 0 #7a9a55);
		pointer-events: auto;
	}
	.cottage::before {
		content: '';
		position: absolute;
		right: 18%;
		top: 0;
		width: 11px;
		height: 18px;
		background: #c48955;
		border-radius: 3px 3px 0 0;
		z-index: 1;
	}
	.cottage::after {
		content: '';
		position: absolute;
		right: 15%;
		top: -10px;
		width: 16px;
		height: 12px;
		background: rgba(255, 246, 234, 0.75);
		border-radius: 50%;
		filter: blur(1.5px);
		animation: smoke 4.5s ease-in-out infinite;
		z-index: 1;
	}
	.cottage .roof {
		display: block;
		height: 34px;
		background: linear-gradient(#e8883a, #c95a32);
		clip-path: polygon(4% 100%, 50% 4%, 96% 100%);
	}
	.cottage .wall {
		display: block;
		background: linear-gradient(#fff8ea, #f3e0ba);
		border-radius: 0 0 22px 22px;
		padding: 8px 8px 14px;
		border: 3px solid #d2b48a;
		border-top: 0;
		box-shadow: inset 0 0 0 2px rgba(255, 250, 242, 0.7);
		position: relative;
	}
	.cottage .icon {
		display: grid;
		place-items: center;
		min-height: 80px;
	}
	.gname {
		display: block;
		margin-top: 4px;
		font-size: 12px;
		font-weight: 800;
		line-height: 1.15;
		min-height: 2.3em;
		overflow: hidden;
		word-break: break-word;
	}
	.stars {
		display: flex;
		gap: 3px;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: 8px;
	}
	.star {
		width: 13px;
		height: 13px;
		background: #e4d3b0;
		clip-path: polygon(50% 2%, 63% 35%, 98% 38%, 70% 59%, 79% 93%, 50% 74%, 21% 93%, 30% 59%, 2% 38%, 37% 35%);
	}
	.star.on {
		background: #f0c14a;
		filter: drop-shadow(0 0 4px #ffe08a);
	}
	.leaf,
	.choice,
	.yes,
	.no,
	.go,
	.book {
		border-radius: 20px;
		background: #fffaf2;
	}
	.leaf {
		width: 56px;
		height: 56px;
		display: grid;
		place-items: center;
		text-decoration: none;
	}
	.leaf svg {
		pointer-events: none;
	}
	.grownups {
		background: #fffaf2;
		border-radius: 999px;
		padding: 10px 16px;
		text-decoration: none;
		box-shadow: 0 4px 0 #6ea85a;
	}
	.sheet,
	.confirm,
	.notice {
		position: fixed;
		inset: 0;
		background: rgba(40, 30, 20, 0.35);
		display: grid;
		place-items: center;
		z-index: 20;
		padding: 24px;
	}
	.notice {
		background:
			radial-gradient(ellipse at 50% 10%, #ffe7b0 0 10%, transparent 32%),
			linear-gradient(#f3c4a0 0%, #f8d7b0 18%, #f6e4c4 42%, #e3ecc0 68%, #b7c882 100%);
	}
	.panel,
	.steps {
		background: #fff4e4;
		border-radius: 36px;
		padding: 22px;
		display: flex;
		gap: 16px;
		flex-wrap: wrap;
		justify-content: center;
		max-width: 560px;
		box-shadow: 0 10px 0 #d2b48a;
	}
	.choice {
		width: 108px;
		height: 108px;
	}
	.confirm .panel {
		flex-direction: column;
		align-items: center;
	}
	.row {
		display: flex;
		gap: 18px;
	}
	.yes,
	.no {
		width: 96px;
		height: 96px;
		font-size: 40px;
	}
	.yes {
		background: #d8f0c8;
	}
	.no {
		background: #f7d4cc;
	}
	.close {
		width: 56px;
		height: 56px;
		border-radius: 16px;
		background: #fff;
		font-size: 24px;
	}
	.steps figure {
		margin: 0;
		width: 120px;
		height: 120px;
		background: #fff;
		border-radius: 24px;
		display: grid;
		place-items: center;
	}
	.notice-actions {
		display: flex;
		gap: 16px;
		align-items: center;
		margin-top: 18px;
	}
	.go {
		min-width: 120px;
		min-height: 72px;
		font-size: 28px;
		padding: 8px 28px;
		box-shadow: 0 6px 0 #6ea85a;
		display: grid;
		place-items: center;
		text-decoration: none;
	}
	.book {
		width: 72px;
		height: 72px;
		display: grid;
		place-items: center;
	}
	@keyframes smoke {
		0%,
		100% {
			transform: translateY(0) scale(1);
			opacity: 0.55;
		}
		50% {
			transform: translateY(-8px) scale(1.25);
			opacity: 0.2;
		}
	}
	@keyframes sun-pulse {
		50% {
			transform: translateX(-50%) scale(1.08);
		}
	}
	@keyframes breeze-fly {
		from {
			transform: translateX(-90px);
		}
		to {
			transform: translateX(110vw);
		}
	}
	@keyframes nest-pulse {
		0%,
		100% {
			box-shadow:
				0 0 0 4px #fff,
				0 0 0 8px #f0c14a,
				0 6px 0 #c9a66b;
		}
		50% {
			box-shadow:
				0 0 0 10px #fff,
				0 0 0 18px #f0c14a,
				0 6px 0 #c9a66b;
		}
	}
	@keyframes tap-bob {
		0%,
		100% {
			transform: translate(0, 0);
		}
		50% {
			transform: translate(-4px, 6px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.sun,
		.fly,
		.cottage,
		.cottage::after,
		.slot.need,
		.pick-hint,
		.tap-hint {
			animation: none;
			transition: none;
		}
	}
</style>

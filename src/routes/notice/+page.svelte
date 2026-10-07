<script lang="ts">
	import { WRITTEN_NOTICE_EN, WRITTEN_NOTICE_IT } from '#lib/play/slots.ts';
</script>

<main>
	<a href="/">←</a>
	<h1>For grown-ups</h1>
	<p>{WRITTEN_NOTICE_EN}</p>
	<h1>Per gli adulti</h1>
	<p>{WRITTEN_NOTICE_IT}</p>
</main>

<style>
	main {
		min-height: 100vh;
		margin: 0 auto;
		max-width: 42rem;
		padding: 24px 20px 64px;
		background:
			radial-gradient(ellipse at 50% 0%, #ffd9a0 0 18%, transparent 48%),
			linear-gradient(#f8e2bc, #efd3a3);
		color: #3c342b;
		font-family: Nunito, 'Avenir Next', 'Segoe UI', sans-serif;
		line-height: 1.45;
	}
	a {
		display: inline-grid;
		place-items: center;
		width: 72px;
		height: 72px;
		border-radius: 50%;
		background: linear-gradient(#fff8ea, #f3e0ba);
		text-decoration: none;
		color: inherit;
		font-size: 32px;
		box-shadow: 0 6px 0 #c9a66b;
	}
	a:focus-visible {
		outline: 3px solid #2f6fed;
		outline-offset: 3px;
	}
	h1 {
		font-size: 1.4rem;
		margin: 28px 0 8px;
	}
</style>

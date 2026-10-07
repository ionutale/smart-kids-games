<script lang="ts">
	import SimplePic from '../play/SimplePic.svelte';
	import type { PicId } from '../play/pictures.ts';
	import { JIGSAW_BOARD, jigsawPad, jigsawShape, piecePath, pieceTabs } from './jigsaw.ts';

	let {
		pic,
		index,
		total,
		hollow = false
	}: {
		pic: PicId;
		index: number;
		total: number;
		hollow?: boolean;
	} = $props();

	const shape = $derived(jigsawShape(total));
	const col = $derived(index % shape.cols);
	const row = $derived(Math.floor(index / shape.cols));
	const slotW = $derived(JIGSAW_BOARD / shape.cols);
	const slotH = $derived(JIGSAW_BOARD / shape.rows);
	const pad = $derived(jigsawPad(slotW, slotH));
	const boxW = $derived(slotW + pad * 2);
	const boxH = $derived(slotH + pad * 2);
	const tabs = $derived(pieceTabs(col, row, shape.cols, shape.rows));
	const d = $derived(piecePath(slotW, slotH, pad, tabs));
</script>

<span class="piece" class:hollow style="width:{boxW}px;height:{boxH}px">
	{#if !hollow}
		<span class="body" style="clip-path: path('{d}');">
			<span class="shift" style="transform:translate({pad - col * slotW}px, {pad - row * slotH}px)">
				<SimplePic {pic} size={JIGSAW_BOARD} />
			</span>
		</span>
	{/if}
	<svg class="cut" viewBox="0 0 {boxW} {boxH}" width={boxW} height={boxH} aria-hidden="true">
		<path
			d={d}
			fill="none"
			stroke={hollow ? '#c9a66b' : '#3c342b'}
			stroke-width={hollow ? 2.2 : 3}
			stroke-dasharray={hollow ? '7 5' : undefined}
			stroke-linejoin="round"
		/>
	</svg>
</span>

<style>
	.piece {
		position: relative;
		display: block;
		pointer-events: none;
		filter: drop-shadow(0 4px 0 rgba(60, 52, 43, 0.18));
	}
	.piece.hollow {
		filter: none;
	}
	.body,
	.cut {
		position: absolute;
		inset: 0;
	}
	.body {
		background: #fffaf2;
		overflow: hidden;
		z-index: 1;
	}
	.cut {
		z-index: 2;
	}
	.shift {
		display: block;
		width: max-content;
		line-height: 0;
	}
</style>

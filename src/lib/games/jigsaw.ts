export const JIGSAW_BOARD = 240;

export type Tab = -1 | 0 | 1;

export type PieceTabs = { top: Tab; right: Tab; bottom: Tab; left: Tab };

export function jigsawShape(total: number) {
	if (total <= 3) return { cols: Math.max(total, 1), rows: 1 };
	if (total === 4) return { cols: 2, rows: 2 };
	if (total === 5) return { cols: 5, rows: 1 };
	return { cols: 3, rows: 2 };
}

export function jigsawPad(slotW: number, slotH: number) {
	return Math.max(14, Math.round(Math.min(slotW, slotH) * 0.34));
}

function knob(col: number, row: number, axis: 0 | 1): Tab {
	return ((col + 1) * 19 + (row + 3) * 37 + axis * 11) % 2 === 0 ? 1 : -1;
}

export function pieceTabs(col: number, row: number, cols: number, rows: number): PieceTabs {
	return {
		left: col === 0 ? 0 : ((-knob(col - 1, row, 0)) as Tab),
		right: col === cols - 1 ? 0 : knob(col, row, 0),
		top: row === 0 ? 0 : ((-knob(col, row - 1, 1)) as Tab),
		bottom: row === rows - 1 ? 0 : knob(col, row, 1)
	};
}

function n(value: number) {
	return Math.round(value * 100) / 100;
}

function tabEdge(
	x: number,
	y: number,
	alongX: number,
	alongY: number,
	outX: number,
	outY: number,
	length: number,
	tab: Tab,
	size: number
) {
	const endX = x + alongX * length;
	const endY = y + alongY * length;
	if (tab === 0) return `L ${n(endX)} ${n(endY)}`;
	const mid = length / 2;
	const s = size;
	const bump = tab * s;
	const p = (along: number, out: number) =>
		`${n(x + alongX * along + outX * out)} ${n(y + alongY * along + outY * out)}`;
	return [
		`L ${p(mid - s, 0)}`,
		`C ${p(mid - s * 0.72, bump * 0.08)} ${p(mid - s * 0.78, bump * 0.72)} ${p(mid - s * 0.42, bump * 0.92)}`,
		`C ${p(mid - s * 0.12, bump * 1.12)} ${p(mid + s * 0.12, bump * 1.12)} ${p(mid + s * 0.42, bump * 0.92)}`,
		`C ${p(mid + s * 0.78, bump * 0.72)} ${p(mid + s * 0.72, bump * 0.08)} ${p(mid + s, 0)}`,
		`L ${n(endX)} ${n(endY)}`
	].join(' ');
}

export function piecePath(slotW: number, slotH: number, pad: number, tabs: PieceTabs) {
	const x0 = pad;
	const y0 = pad;
	const x1 = pad + slotW;
	const y1 = pad + slotH;
	const size = Math.min(slotW, slotH) * 0.3;
	return [
		`M ${n(x0)} ${n(y0)}`,
		tabEdge(x0, y0, 1, 0, 0, -1, slotW, tabs.top, size),
		tabEdge(x1, y0, 0, 1, 1, 0, slotH, tabs.right, size),
		tabEdge(x1, y1, -1, 0, 0, 1, slotW, tabs.bottom, size),
		tabEdge(x0, y1, 0, -1, -1, 0, slotH, tabs.left, size),
		'Z'
	].join(' ');
}

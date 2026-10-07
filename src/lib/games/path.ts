export type PathShape = 'straight' | 'one-bend' | 'two-bends';

export function pathBoard(taps: number, shape: PathShape, withDecoy: boolean) {
	const cells = walk(taps, shape);
	const cols = Math.max(...cells.map((cell) => cell.col)) + 1;
	const rows = Math.max(...cells.map((cell) => cell.row)) + 1;
	const path = cells.map((cell) => cell.row * cols + cell.col);
	let decoy: number | null = null;
	if (withDecoy) {
		const taken = new Set(path);
		for (let row = 0; row < rows && decoy === null; row++) {
			for (let col = 0; col < cols; col++) {
				const i = row * cols + col;
				if (!taken.has(i) && besidePath(col, row, cells)) {
					decoy = i;
					break;
				}
			}
		}
	}
	return { cols, rows, path, decoy };
}

function walk(taps: number, shape: PathShape) {
	if (shape === 'straight') {
		return range(taps + 1).map((col) => ({ col, row: 0 }));
	}
	if (shape === 'one-bend') {
		const across = taps;
		const cells = range(across).map((col) => ({ col, row: 0 }));
		cells.push({ col: across - 1, row: 1 });
		return cells;
	}
	const across = Math.ceil((taps + 1) / 2);
	const down = taps + 1 - across;
	const cells = range(across).map((col) => ({ col, row: 0 }));
	for (let row = 1; row < down; row++) cells.push({ col: across - 1, row });
	cells.push({ col: across - 2, row: down - 1 });
	return cells.slice(0, taps + 1);
}

function besidePath(col: number, row: number, cells: Array<{ col: number; row: number }>) {
	return cells.some((cell) => Math.abs(cell.col - col) + Math.abs(cell.row - row) === 1);
}

function range(count: number) {
	return Array.from({ length: count }, (_, i) => i);
}

import { describe, expect, test } from 'vitest';
import { pathBoard } from '../src/lib/games/path.ts';
import { PATH_LEVELS } from '../src/lib/games/tables.ts';

describe('path boards', () => {
	test('every level is a connected trail of the right length', () => {
		for (const level of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const) {
			const help = PATH_LEVELS[level];
			const board = pathBoard(help.taps, help.shape, help.decoy);
			expect(board.path).toHaveLength(help.taps + 1);
			for (let i = 1; i < board.path.length; i++) {
				const prev = { col: board.path[i - 1]! % board.cols, row: Math.floor(board.path[i - 1]! / board.cols) };
				const next = { col: board.path[i]! % board.cols, row: Math.floor(board.path[i]! / board.cols) };
				expect(Math.abs(prev.col - next.col) + Math.abs(prev.row - next.row)).toBe(1);
			}
			if (help.decoy) {
				expect(board.decoy).not.toBeNull();
				expect(board.path.includes(board.decoy!)).toBe(false);
			} else expect(board.decoy).toBeNull();
		}
	});
});

import { describe, expect, test } from 'vitest';
import { JIGSAW_BOARD, jigsawPad, jigsawShape, piecePath, pieceTabs } from '../src/lib/games/jigsaw.ts';

describe('jigsaw pieces', () => {
	test('neighbouring tabs fit together and outer edges stay flat', () => {
		const { cols, rows } = jigsawShape(4);
		const a = pieceTabs(0, 0, cols, rows);
		const b = pieceTabs(1, 0, cols, rows);
		const c = pieceTabs(0, 1, cols, rows);
		expect(a.left).toBe(0);
		expect(a.top).toBe(0);
		expect(b.right).toBe(0);
		expect(c.bottom).toBe(0);
		expect(a.right).not.toBe(0);
		expect(a.right).toBe(-b.left);
		expect(a.bottom).not.toBe(0);
		expect(a.bottom).toBe(-c.top);
	});

	test('an inner edge is a jigsaw tab, not a straight cut', () => {
		const { cols, rows } = jigsawShape(4);
		const slot = JIGSAW_BOARD / cols;
		const pad = jigsawPad(slot, slot);
		const tabs = pieceTabs(0, 0, cols, rows);
		const path = piecePath(slot, slot, pad, tabs);
		expect(path.startsWith('M ')).toBe(true);
		expect(path).toContain(' C ');
		expect(path.endsWith('Z')).toBe(true);
	});
});

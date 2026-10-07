import { describe, expect, test } from 'vitest';
import {
	MAX_PICTURE_SLOTS,
	addPictureSlot,
	createMemorySlotStore,
	createPictureSlot,
	erasePictureSlot,
	nestsFrom,
	parseDeviceSlots,
	keepKnownSlots,
	startPictureSlot
} from '../src/lib/play/slots.ts';
import type { PlayRecord } from '../src/lib/play/types.ts';

describe('picture slots', () => {
	test('create stores only id, art id, and language', () => {
		const slot = createPictureSlot({ artId: 'bird', language: 'it' });
		expect(slot.artId).toBe('bird');
		expect(slot.language).toBe('it');
		expect(slot.id).toBeTruthy();
		expect(Object.keys(slot).sort()).toEqual(['artId', 'id', 'language']);
	});

	test('create rejects a fifth nest and extra identity fields', () => {
		const full = {
			ids: ['a', 'b', 'c', 'd'],
			activeId: 'a',
			noticeSeen: true,
			pendingLanguage: 'it' as const
		};
		expect(MAX_PICTURE_SLOTS).toBe(4);
		expect(() => addPictureSlot(full, createPictureSlot({ artId: 'cat' }))).toThrow(
			/full|four/i
		);
		expect(() => addPictureSlot({ ids: [], activeId: null, noticeSeen: false, pendingLanguage: 'it' }, createPictureSlot({ artId: 'cat' }))).toThrow(
			/notice/i
		);
		expect(() =>
			createPictureSlot({ artId: 'bird', language: 'en', name: 'Mia' } as never)
		).toThrow(/name|email|photo|voice/i);
	});

	test('start then erase removes the slot and its play records', async () => {
		const records: PlayRecord[] = [];
		const store = createMemorySlotStore({ records });
		const started = await startPictureSlot(
			store,
			{ ...parseDeviceSlots(undefined), noticeSeen: true },
			'rabbit',
			'en'
		);

		expect(started.device.ids).toHaveLength(1);
		expect(started.device.activeId).toBe(started.slot.id);
		expect(started.device.noticeSeen).toBe(true);
		expect(nestsFrom(started.device, [started.slot])).toEqual([
			started.slot,
			null,
			null,
			null
		]);

		records.push({
			slotId: started.slot.id,
			game: 'paint',
			level: 1,
			timeMs: 4000,
			date: '2026-10-05'
		});
		records.push({
			slotId: 'other',
			game: 'memory',
			level: 2,
			timeMs: 8000,
			date: '2026-10-05'
		});

		const erased = await erasePictureSlot(store, started.device, started.slot.id);
		expect(erased.device.ids).toEqual([]);
		expect(erased.device.activeId).toBeNull();
		expect(await store.listSlots([started.slot.id])).toEqual([]);
		expect(records).toEqual([
			{
				slotId: 'other',
				game: 'memory',
				level: 2,
				timeMs: 8000,
				date: '2026-10-05'
			}
		]);
	});

	test('keepKnownSlots drops cookie ids that have no picture slot', () => {
		const kept = createPictureSlot({ artId: 'bird', id: 'keep-me' });
		const device = {
			ids: ['gone', kept.id, 'also-gone'],
			activeId: 'gone',
			noticeSeen: true,
			pendingLanguage: 'en' as const
		};
		const synced = keepKnownSlots(device, [kept]);
		expect(synced.ids).toEqual([kept.id]);
		expect(synced.activeId).toBe(kept.id);
		expect(keepKnownSlots(synced, [kept])).toBe(synced);
	});
});

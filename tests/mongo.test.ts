import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { PictureSlot, PlayRecord } from '../src/lib/play/types.ts';
import { FRIEND_ART_IDS, GAME_IDS, LANGUAGES, PLAY_RECORD_KEYS, PICTURE_SLOT_KEYS } from '../src/lib/play/types.ts';

const { MongoClientMock, attachDatabasePool } = vi.hoisted(() => ({
	MongoClientMock: vi.fn(),
	attachDatabasePool: vi.fn()
}));

vi.mock('mongodb', () => ({
	MongoClient: class MongoClient {
		constructor(uri: string, options: unknown) {
			MongoClientMock(uri, options);
		}
	}
}));

vi.mock('@vercel/functions', () => ({
	attachDatabasePool
}));

vi.mock('$app/env/private', () => ({
	MONGODB_URI: 'mongodb://example.test'
}));

const FORBIDDEN = ['name', 'email', 'photo', 'voice'] as const;

describe('picture slot and play record types', () => {
	test('picture slot stores only id, art id, and Home language', () => {
		expect(PICTURE_SLOT_KEYS).toEqual(['id', 'artId', 'language']);
		expect(FRIEND_ART_IDS).toEqual(['bird', 'cat', 'dog', 'rabbit']);
		expect(LANGUAGES).toEqual(['it', 'en']);
		for (const key of FORBIDDEN) {
			expect(PICTURE_SLOT_KEYS).not.toContain(key);
		}

		const slot: PictureSlot = {
			id: 'slot-1',
			artId: 'bird',
			language: 'it'
		};
		expect(Object.keys(slot).sort()).toEqual(['artId', 'id', 'language']);
	});

	test('play record stores game, level, time, and date on a slot', () => {
		expect(PLAY_RECORD_KEYS).toEqual(['slotId', 'game', 'level', 'timeMs', 'date']);
		expect(GAME_IDS).toContain('paint');
		expect(GAME_IDS).toContain('sound-safari');
		for (const key of FORBIDDEN) {
			expect(PLAY_RECORD_KEYS).not.toContain(key);
		}

		const record: PlayRecord = {
			slotId: 'slot-1',
			game: 'paint',
			level: 1,
			timeMs: 12_000,
			date: '2026-10-05'
		};
		expect(Object.keys(record).sort()).toEqual(['date', 'game', 'level', 'slotId', 'timeMs']);
	});
});

describe('mongo client', () => {
	beforeEach(() => {
		MongoClientMock.mockClear();
		attachDatabasePool.mockClear();
	});

	test('creates one client from MONGODB_URI and attaches the pool', async () => {
		const mongo = await import('../src/lib/server/mongo.server.ts');
		expect(MongoClientMock).not.toHaveBeenCalled();

		const first = mongo.getMongoClient();
		const second = mongo.getMongoClient();

		expect(first).toBe(second);
		expect(MongoClientMock).toHaveBeenCalledOnce();
		expect(MongoClientMock).toHaveBeenCalledWith('mongodb://example.test', {
			maxIdleTimeMS: 60_000,
			minPoolSize: 0
		});
		expect(attachDatabasePool).toHaveBeenCalledOnce();
		expect(attachDatabasePool).toHaveBeenCalledWith(first);
	});
});

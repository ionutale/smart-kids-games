export const GAME_IDS = [
	'paint',
	'memory',
	'animals',
	'vehicles',
	'food',
	'shapes',
	'clothes',
	'toys',
	'instruments',
	'little-phrase',
	'count',
	'math',
	'stickers',
	'sorting',
	'categories',
	'speed',
	'next',
	'path',
	'jigsaw',
	'odd-one-out',
	'shadow',
	'weather',
	'sound-safari'
] as const;

export type GameId = (typeof GAME_IDS)[number];

export const FRIEND_ART_IDS = ['bird', 'cat', 'dog', 'rabbit'] as const;
export type FriendArtId = (typeof FRIEND_ART_IDS)[number];

export const LANGUAGES = ['it', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];

export const PICTURE_SLOT_KEYS = ['id', 'artId', 'language'] as const;
export const PLAY_RECORD_KEYS = ['slotId', 'game', 'level', 'timeMs', 'date'] as const;

export type Level = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type PictureSlot = {
	id: string;
	artId: FriendArtId;
	language: Language;
};

export type PlayRecord = {
	slotId: string;
	game: GameId;
	level: Level;
	timeMs: number;
	date: string;
};

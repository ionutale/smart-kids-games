import type { GameId, Level, PlayRecord } from './types.ts';

export function finishedLevels(records: PlayRecord[], game: GameId): Level[] {
	const seen = new Set<Level>();
	for (const record of records) {
		if (record.game === game) seen.add(record.level);
	}
	return [...seen].sort((a, b) => a - b);
}

export function litStarCount(records: PlayRecord[], game: GameId): number {
	return finishedLevels(records, game).length;
}

export function starsForHome(records: PlayRecord[], game: GameId): boolean[] {
	const done = new Set(finishedLevels(records, game));
	return Array.from({ length: 10 }, (_, i) => done.has((i + 1) as Level));
}

export function rowComplete(stars: boolean[]): boolean {
	return stars.length === 10 && stars.every(Boolean);
}

export type CheerKind = 'star' | 'all';

export function cheerKind(firstFinish: boolean, stars: boolean[]): CheerKind | null {
	if (!firstFinish) return null;
	return rowComplete(stars) ? 'all' : 'star';
}

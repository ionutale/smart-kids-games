import type { GameId, Language, Level, PictureSlot, PlayRecord } from './types.ts';
import { finishedLevels } from './stars.ts';

export function copyLanguage(slot: PictureSlot): Language {
	return slot.language;
}

export function nextUnfinishedLevel(records: PlayRecord[], game: GameId): Level {
	const done = new Set(finishedLevels(records, game));
	for (let level = 1; level <= 10; level++) {
		if (!done.has(level as Level)) return level as Level;
	}
	return 10;
}

export function canReplay(records: PlayRecord[], game: GameId, level: Level): boolean {
	return finishedLevels(records, game).includes(level);
}

export function bestTimeMs(records: PlayRecord[], game: GameId, level: Level): number | null {
	const times = records.filter((record) => record.game === game && record.level === level).map((record) => record.timeMs);
	if (times.length === 0) return null;
	return Math.min(...times);
}

export function finishOutcome(
	records: PlayRecord[],
	game: GameId,
	level: Level,
	timeMs: number
): { firstFinish: boolean; faster: boolean } {
	const best = bestTimeMs(records, game, level);
	return {
		firstFinish: best === null,
		faster: best !== null && timeMs < best
	};
}

export function playRecord(slotId: string, game: GameId, level: Level, timeMs: number, date = new Date()): PlayRecord {
	return {
		slotId,
		game,
		level,
		timeMs,
		date: date.toISOString().slice(0, 10)
	};
}

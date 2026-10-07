import { GAME_IDS, type GameId } from './types.ts';

export const CATALOG = GAME_IDS.map((id) => ({ id }));

export function isGameId(value: string): value is GameId {
	return (GAME_IDS as readonly string[]).includes(value);
}

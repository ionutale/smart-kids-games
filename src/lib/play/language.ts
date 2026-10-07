import { LANGUAGES, type GameId, type Language, type PictureSlot } from './types.ts';

export const LANGUAGE_NAME: Record<Language, string> = {
	it: 'Italiano',
	en: 'English'
};

export const PICK_FRIEND: Record<Language, string> = {
	it: 'Scegli un amico',
	en: 'Pick a friend'
};

export const FASTER_VOICE: Record<Language, string> = {
	it: 'Più veloce',
	en: 'Faster'
};

export const STAR_VOICE: Record<Language, string> = {
	it: 'Una stella!',
	en: 'A star!'
};

export const ALL_STARS_VOICE: Record<Language, string> = {
	it: 'Tutte le stelle!',
	en: 'All the stars!'
};

export const PATH_PROMPT: Record<Language, string> = {
	it: "Porta l'uccello alla mela",
	en: 'Take the bird to the apple'
};

export const WEATHER_PROMPT: Record<Language, string> = {
	it: 'Che tempo fa?',
	en: 'What is the weather?'
};

export const CATEGORY_PROMPT: Record<Language, string> = {
	it: "Tocca un'immagine, poi il cestino",
	en: 'Tap a picture, then its basket'
};

export const SORT_PROMPT: Record<Language, string> = {
	it: 'Tocca un disegno, poi il cestino giusto',
	en: 'Tap a picture, then the right basket'
};

export const ODD_PROMPT: Record<Language, string> = {
	it: 'Quale è diverso?',
	en: 'Which is different?'
};

export const GAME_NAME: Record<GameId, Record<Language, string>> = {
	paint: { en: 'Paint', it: 'Dipingere' },
	memory: { en: 'Memory', it: 'Memory' },
	animals: { en: 'Animals', it: 'Animali' },
	vehicles: { en: 'Vehicles', it: 'Mezzi' },
	food: { en: 'Food', it: 'Cibo' },
	shapes: { en: 'Shapes', it: 'Forme' },
	clothes: { en: 'Clothes', it: 'Vestiti' },
	toys: { en: 'Toys', it: 'Giochi' },
	instruments: { en: 'Instruments', it: 'Strumenti' },
	'little-phrase': { en: 'Little phrase', it: 'Frasetta' },
	count: { en: 'Count', it: 'Conta' },
	math: { en: 'Math', it: 'Insieme' },
	stickers: { en: 'Stickers', it: 'Adesivi' },
	sorting: { en: 'Sorting', it: 'Ordina' },
	categories: { en: 'Categories', it: 'Categorie' },
	speed: { en: 'Speed', it: 'Veloce' },
	next: { en: 'What comes next', it: 'Poi' },
	path: { en: 'Path', it: 'Percorso' },
	jigsaw: { en: 'Jigsaw', it: 'Puzzle' },
	'odd-one-out': { en: 'Odd one', it: 'Diverso' },
	shadow: { en: 'Shadow', it: 'Ombra' },
	weather: { en: 'Weather', it: 'Tempo' },
	'sound-safari': { en: 'Sounds', it: 'Suoni' }
};

export function isLanguage(value: string): value is Language {
	return (LANGUAGES as readonly string[]).includes(value);
}

export function setSlotLanguage(slot: PictureSlot, language: Language): PictureSlot {
	return { id: slot.id, artId: slot.artId, language };
}

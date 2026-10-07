import type { Language } from './types.ts';

export type PicId =
	| 'bird'
	| 'cat'
	| 'dog'
	| 'rabbit'
	| 'car'
	| 'bus'
	| 'bike'
	| 'train'
	| 'apple'
	| 'banana'
	| 'bread'
	| 'milk'
	| 'red-circle'
	| 'yellow-triangle'
	| 'blue-square'
	| 'green-star'
	| 'shirt'
	| 'trousers'
	| 'hat'
	| 'shoes'
	| 'ball'
	| 'blocks'
	| 'doll'
	| 'kite'
	| 'drum'
	| 'piano'
	| 'guitar'
	| 'flute';

export const NAMES: Record<PicId, Record<Language, string>> = {
	bird: { en: 'bird', it: 'uccello' },
	cat: { en: 'cat', it: 'gatto' },
	dog: { en: 'dog', it: 'cane' },
	rabbit: { en: 'rabbit', it: 'coniglio' },
	car: { en: 'car', it: 'auto' },
	bus: { en: 'bus', it: 'bus' },
	bike: { en: 'bike', it: 'bici' },
	train: { en: 'train', it: 'treno' },
	apple: { en: 'apple', it: 'mela' },
	banana: { en: 'banana', it: 'banana' },
	bread: { en: 'bread', it: 'pane' },
	milk: { en: 'milk', it: 'latte' },
	'red-circle': { en: 'red', it: 'rosso' },
	'yellow-triangle': { en: 'yellow', it: 'giallo' },
	'blue-square': { en: 'blue', it: 'blu' },
	'green-star': { en: 'green', it: 'verde' },
	shirt: { en: 'shirt', it: 'maglia' },
	trousers: { en: 'trousers', it: 'pantaloni' },
	hat: { en: 'hat', it: 'cappello' },
	shoes: { en: 'shoes', it: 'scarpe' },
	ball: { en: 'ball', it: 'palla' },
	blocks: { en: 'blocks', it: 'costruzioni' },
	doll: { en: 'doll', it: 'bambola' },
	kite: { en: 'kite', it: 'aquilone' },
	drum: { en: 'drum', it: 'tamburo' },
	piano: { en: 'piano', it: 'piano' },
	guitar: { en: 'guitar', it: 'chitarra' },
	flute: { en: 'flute', it: 'flauto' }
};

export const SHAPE_NAMES: Record<string, Record<Language, string>> = {
	'red-circle': { en: 'circle', it: 'cerchio' },
	'yellow-triangle': { en: 'triangle', it: 'triangolo' },
	'blue-square': { en: 'square', it: 'quadrato' },
	'green-star': { en: 'star', it: 'stella' }
};

export const FRIENDS: PicId[] = ['bird', 'cat', 'dog', 'rabbit'];
export const VEHICLES: PicId[] = ['car', 'bus', 'bike', 'train'];
export const FOOD: PicId[] = ['apple', 'banana', 'bread', 'milk'];
export const SHAPES: PicId[] = ['red-circle', 'yellow-triangle', 'blue-square', 'green-star'];
export const CLOTHES: PicId[] = ['shirt', 'trousers', 'hat', 'shoes'];
export const TOYS: PicId[] = ['ball', 'blocks', 'doll', 'kite'];
export const INSTRUMENTS: PicId[] = ['drum', 'piano', 'guitar', 'flute'];

export const QUIZ_SETS: Record<string, PicId[]> = {
	animals: FRIENDS,
	vehicles: VEHICLES,
	food: FOOD,
	shapes: SHAPES,
	clothes: CLOTHES,
	toys: TOYS,
	instruments: INSTRUMENTS
};

export const COLOR_FAMILIES = [
	'red',
	'yellow',
	'blue',
	'green',
	'orange',
	'purple',
	'brown',
	'black',
	'white'
] as const;
export type ColorFamily = (typeof COLOR_FAMILIES)[number];

export const FAMILY_SWATCH: Record<ColorFamily, string> = {
	red: '#ce2b37',
	yellow: '#f2c84b',
	blue: '#3b6fd4',
	green: '#6ea85a',
	orange: '#e8883a',
	purple: '#7b5ea7',
	brown: '#8a5a3a',
	black: '#3c342b',
	white: '#fffaf2'
};

export const FAMILY_NAME: Record<ColorFamily, Record<Language, string>> = {
	red: { en: 'red', it: 'rosso' },
	yellow: { en: 'yellow', it: 'giallo' },
	blue: { en: 'blue', it: 'blu' },
	green: { en: 'green', it: 'verde' },
	orange: { en: 'orange', it: 'arancione' },
	purple: { en: 'purple', it: 'viola' },
	brown: { en: 'brown', it: 'marrone' },
	black: { en: 'black', it: 'nero' },
	white: { en: 'white', it: 'bianco' }
};

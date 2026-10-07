import type { Language, Level } from './types.ts';

export const WEATHER_IDS = ['sun', 'rain', 'cloud', 'snow', 'wind', 'storm'] as const;
export type WeatherId = (typeof WEATHER_IDS)[number];

export const WEATHER_NAME: Record<WeatherId, Record<Language, string>> = {
	sun: { en: 'Sun', it: 'Sole' },
	rain: { en: 'Rain', it: 'Pioggia' },
	cloud: { en: 'Cloud', it: 'Nuvola' },
	snow: { en: 'Snow', it: 'Neve' },
	wind: { en: 'Wind', it: 'Vento' },
	storm: { en: 'Storm', it: 'Temporale' }
};

export const WEATHER_POOLS: Record<Level, WeatherId[]> = {
	1: ['sun', 'rain'],
	2: ['sun', 'rain'],
	3: ['sun', 'rain', 'cloud'],
	4: ['sun', 'rain', 'cloud'],
	5: ['sun', 'rain', 'cloud', 'snow'],
	6: ['sun', 'rain', 'cloud', 'snow'],
	7: ['sun', 'rain', 'cloud', 'snow', 'wind'],
	8: ['sun', 'rain', 'cloud', 'snow', 'wind'],
	9: ['sun', 'rain', 'cloud', 'snow', 'wind', 'storm'],
	10: ['sun', 'rain', 'cloud', 'snow', 'wind', 'storm']
};

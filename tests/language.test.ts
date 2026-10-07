import { describe, expect, test } from 'vitest';
import { LANGUAGE_NAME, setSlotLanguage } from '../src/lib/play/language.ts';
import { createPictureSlot } from '../src/lib/play/slots.ts';

describe('language', () => {
	test('writes Home language onto the picture slot only', () => {
		const slot = createPictureSlot({ artId: 'dog', language: 'it' });
		const next = setSlotLanguage(slot, 'en');
		expect(next).toEqual({ id: slot.id, artId: 'dog', language: 'en' });
		expect(LANGUAGE_NAME.it).toBe('Italiano');
		expect(LANGUAGE_NAME.en).toBe('English');
		expect(Object.keys(next).sort()).toEqual(['artId', 'id', 'language']);
	});
});

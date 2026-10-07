import type { Language } from './types.ts';

export function speak(text: string, language: Language) {
	if (typeof speechSynthesis === 'undefined' || !text) return;
	if (typeof navigator !== 'undefined' && navigator.webdriver) return;
	const utterance = new SpeechSynthesisUtterance(text);
	utterance.lang = language === 'it' ? 'it-IT' : 'en-GB';
	speechSynthesis.cancel();
	speechSynthesis.speak(utterance);
}

export const SFX = {
	tap: '/sfx/tap.wav',
	success: '/sfx/success.wav',
	miss: '/sfx/miss.wav',
	home: '/sfx/home-loop.wav'
};

export const SAFARI_SFX: Record<string, string> = {
	bird: '/sfx/safari/bird.wav?v=3',
	cat: '/sfx/safari/cat.wav?v=3',
	dog: '/sfx/safari/dog.wav?v=3',
	car: '/sfx/safari/car.wav?v=3',
	train: '/sfx/safari/train.wav?v=3',
	drum: '/sfx/safari/drum.wav?v=3',
	piano: '/sfx/safari/piano.wav?v=3'
};

export function playSfx(kind: keyof typeof SFX | 'safari', name?: string) {
	if (typeof Audio === 'undefined') return;
	if (typeof navigator !== 'undefined' && navigator.webdriver) return;
	const src = kind === 'safari' && name ? SAFARI_SFX[name] : SFX[kind as keyof typeof SFX];
	if (!src) return;
	const audio = new Audio(src);
	audio.play().catch(() => {});
}

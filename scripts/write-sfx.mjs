import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RATE = 22050;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'static', 'sfx');

function tone(freq, i) {
	return Math.sin((2 * Math.PI * freq * i) / RATE);
}

function env(i, n, attack = 0.04, release = 0.22) {
	const t = i / Math.max(n - 1, 1);
	if (t < attack) return t / attack;
	if (t > 1 - release) return Math.max(0, (1 - t) / release);
	return 1;
}

function noise(i) {
	let x = (i * 1664525 + 1013904223) >>> 0;
	return (x / 0xffffffff) * 2 - 1;
}

function mix(length, write) {
	const samples = new Float64Array(length);
	write(samples);
	return samples;
}

function seconds(n) {
	return Math.floor(n * RATE);
}

function writeWav(path, samples, gain = 0.32) {
	const n = samples.length;
	const buf = Buffer.alloc(44 + n * 2);
	buf.write('RIFF', 0);
	buf.writeUInt32LE(36 + n * 2, 4);
	buf.write('WAVE', 8);
	buf.write('fmt ', 12);
	buf.writeUInt32LE(16, 16);
	buf.writeUInt16LE(1, 20);
	buf.writeUInt16LE(1, 22);
	buf.writeUInt32LE(RATE, 24);
	buf.writeUInt32LE(RATE * 2, 28);
	buf.writeUInt16LE(2, 32);
	buf.writeUInt16LE(16, 34);
	buf.write('data', 36);
	buf.writeUInt32LE(n * 2, 40);
	for (let i = 0; i < n; i++) {
		const s = Math.max(-1, Math.min(1, samples[i] * gain));
		buf.writeInt16LE(s * 32767, 44 + i * 2);
	}
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, buf);
}

function lerp(a, b, t) {
	return a + (b - a) * Math.max(0, Math.min(1, t));
}

function stamp(out, start, length, write) {
	for (let i = 0; i < length; i++) {
		const j = start + i;
		if (j >= 0 && j < out.length) out[j] += write(i, length);
	}
}

function wave(kind, phase) {
	if (kind === 'saw') {
		const frac = phase / (2 * Math.PI) - Math.floor(phase / (2 * Math.PI));
		return 2 * frac - 1;
	}
	return Math.sin(phase);
}

function sweep(out, start, n, freqAt, voices, ampAt) {
	const phases = voices.map(() => 0);
	for (let i = 0; i < n; i++) {
		const j = start + i;
		if (j < 0 || j >= out.length) continue;
		const freq = freqAt(i, n);
		let sample = 0;
		for (let v = 0; v < voices.length; v++) {
			const voice = voices[v];
			phases[v] += (2 * Math.PI * freq * voice.ratio) / RATE;
			sample += wave(voice.kind ?? 'sine', phases[v]) * (voice.amp ?? 1);
		}
		out[j] += sample * ampAt(i, n);
	}
}

const files = {
	'tap.wav': mix(seconds(0.08), (out) => {
		for (let i = 0; i < out.length; i++) out[i] = tone(880, i) * env(i, out.length, 0.02, 0.7);
	}),
	'success.wav': mix(seconds(0.42), (out) => {
		const split = seconds(0.18);
		for (let i = 0; i < out.length; i++) {
			if (i < split) out[i] = tone(523.25, i) * env(i, split, 0.05, 0.35);
			else out[i] = tone(783.99, i - split) * env(i - split, out.length - split, 0.04, 0.4);
		}
	}),
	'miss.wav': mix(seconds(0.18), (out) => {
		for (let i = 0; i < out.length; i++) {
			out[i] = (tone(180, i) * 0.7 + noise(i) * 0.15) * env(i, out.length, 0.02, 0.55);
		}
	}),
	'home-loop.wav': mix(seconds(6), (out) => {
		for (let i = 0; i < out.length; i++) {
			const pulse = 0.55 + 0.45 * Math.sin((2 * Math.PI * i) / RATE / 3);
			out[i] =
				(tone(261.63, i) * 0.45 + tone(392.0, i) * 0.35 + tone(523.25, i) * 0.12) * pulse * 0.55;
		}
	}),
	'safari/bird.wav': mix(seconds(0.7), (out) => {
		const tweet = seconds(0.08);
		const tweets = [
			[0, 3400, 2300],
			[seconds(0.13), 3900, 2500],
			[seconds(0.3), 3000, 1700]
		];
		for (const [start, from, to] of tweets) {
			sweep(
				out,
				start,
				tweet,
				(i, n) => lerp(from, to, i / n),
				[
					{ ratio: 1, amp: 1 },
					{ ratio: 1.45, amp: 0.22 }
				],
				(i, n) => env(i, n, 0.06, 0.32)
			);
		}
	}),
	'safari/cat.wav': mix(seconds(0.78), (out) => {
		sweep(
			out,
			0,
			out.length,
			(i, n) => {
				const t = i / n;
				const freq = t < 0.22 ? lerp(400, 1250, t / 0.22) : lerp(1250, 260, (t - 0.22) / 0.78);
				return freq * (1 + 0.02 * Math.sin((2 * Math.PI * 8 * i) / RATE));
			},
			[
				{ ratio: 1, amp: 0.5, kind: 'saw' },
				{ ratio: 1, amp: 0.45 },
				{ ratio: 2.15, amp: 0.22 }
			],
			(i, n) => env(i, n, 0.07, 0.2)
		);
	}),
	'safari/dog.wav': mix(seconds(0.72), (out) => {
		const bark = seconds(0.17);
		for (const start of [0, seconds(0.26)]) {
			sweep(
				out,
				start,
				bark,
				(i, n) => lerp(360, 90, (i / n) ** 0.5),
				[
					{ ratio: 1, amp: 0.48, kind: 'saw' },
					{ ratio: 1, amp: 0.4 },
					{ ratio: 0.5, amp: 0.35 }
				],
				(i, n) => env(i, n, 0.03, 0.42)
			);
			stamp(out, start, bark, (i, n) => {
				return noise(i + start) * 0.42 * env(i, seconds(0.045), 0.01, 0.65) * env(i, n, 0.03, 0.42);
			});
		}
	}),
	'safari/car.wav': mix(seconds(1.05), (out) => {
		const rev = seconds(0.62);
		sweep(
			out,
			0,
			rev,
			(i, n) => lerp(58, 180, i / n),
			[
				{ ratio: 1, amp: 0.55, kind: 'saw' },
				{ ratio: 2, amp: 0.22, kind: 'saw' }
			],
			(i, n) => env(i, n, 0.1, 0.16)
		);
		stamp(out, 0, rev, (i, n) => noise(i) * 0.1 * env(i, n, 0.1, 0.16));
		const honk = seconds(0.1);
		for (const start of [seconds(0.7), seconds(0.86)]) {
			stamp(out, start, honk, (i, n) => (tone(466, i) + tone(622, i) * 0.55) * env(i, n, 0.05, 0.28));
		}
	}),
	'safari/train.wav': mix(seconds(1.15), (out) => {
		const chug = seconds(0.09);
		for (let k = 0; k < 5; k++) {
			stamp(out, k * seconds(0.12), chug, (i, n) => {
				return (tone(88, i) * 0.45 + noise(i + k * 91) * 0.72) * env(i, n, 0.04, 0.5);
			});
		}
		const whistle = seconds(0.22);
		sweep(
			out,
			seconds(0.62),
			whistle,
			(i) => 880 + 14 * Math.sin((2 * Math.PI * 6 * i) / RATE),
			[
				{ ratio: 1, amp: 1 },
				{ ratio: 1.5, amp: 0.28 }
			],
			(i, n) => env(i, n, 0.08, 0.24)
		);
		sweep(
			out,
			seconds(0.88),
			whistle,
			(i) => 698 + 12 * Math.sin((2 * Math.PI * 6 * i) / RATE),
			[
				{ ratio: 1, amp: 1 },
				{ ratio: 1.5, amp: 0.28 }
			],
			(i, n) => env(i, n, 0.08, 0.26)
		);
	}),
	'safari/drum.wav': mix(seconds(0.5), (out) => {
		const hit = seconds(0.16);
		for (const [start, top] of [
			[0, 150],
			[seconds(0.2), 95]
		]) {
			sweep(
				out,
				start,
				hit,
				(i, n) => lerp(top, 42, i / n),
				[{ ratio: 1, amp: 0.95 }],
				(i, n) => Math.exp(-8 * (i / n)) * env(i, n, 0.004, 0.5)
			);
			stamp(out, start, hit, (i, n) => {
				return noise(i + start) * 0.55 * env(i, seconds(0.03), 0.004, 0.7) * env(i, n, 0.004, 0.5);
			});
		}
	}),
	'safari/piano.wav': mix(seconds(1), (out) => {
		const notes = [523.25, 659.25, 783.99];
		const hold = seconds(0.55);
		notes.forEach((freq, k) => {
			stamp(out, k * seconds(0.16), hold, (i, n) => {
				const decay = Math.exp(-4.1 * (i / n));
				const hammer = noise(i + k * 19) * env(i, seconds(0.012), 0.002, 0.7) * 0.22;
				const body = (tone(freq, i) + tone(freq * 2, i) * 0.32 + tone(freq * 3, i) * 0.1) * decay;
				return (body + hammer) * env(i, n, 0.004, 0.32);
			});
		});
	})
};

for (const [name, samples] of Object.entries(files)) {
	const gain = name === 'home-loop.wav' ? 0.18 : name === 'tap.wav' ? 0.28 : 0.34;
	writeWav(join(ROOT, name), samples, gain);
	console.log('wrote', name);
}

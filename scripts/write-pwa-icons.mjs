import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const svg = readFileSync(join(root, 'static', 'pwa-icon.svg'));

function png(size) {
	return new Resvg(svg, {
		fitTo: { mode: 'width', value: size },
		background: '#9fd6f5'
	})
		.render()
		.asPng();
}

writeFileSync(join(root, 'static', 'pwa-192.png'), png(192));
writeFileSync(join(root, 'static', 'pwa-512.png'), png(512));
writeFileSync(join(root, 'static', 'pwa-180.png'), png(180));

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test } from 'vitest';

test('.env.example lists MONGODB_URI with no secret', () => {
	const text = readFileSync(resolve(process.cwd(), '.env.example'), 'utf8');
	expect(text).toMatch(/^MONGODB_URI=\s*$/m);
	expect(text).not.toMatch(/mongodb\+srv:\/\//);
	expect(text).not.toMatch(/:/);
});

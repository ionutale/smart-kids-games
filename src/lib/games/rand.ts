export function shuffle<T>(items: T[]): T[] {
	const next = [...items];
	for (let i = next.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[next[i], next[j]] = [next[j]!, next[i]!];
	}
	return next;
}

export function pick<T>(items: T[], count: number): T[] {
	return shuffle(items).slice(0, Math.min(count, items.length));
}

export function range(min: number, max: number): number {
	return min + Math.floor(Math.random() * (max - min + 1));
}

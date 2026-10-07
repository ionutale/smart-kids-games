import { fail, redirect } from '@sveltejs/kit';
import { isGameId } from '#lib/play/catalog.ts';
import { canReplay, copyLanguage, finishOutcome, nextUnfinishedLevel, playRecord } from '#lib/play/runtime.ts';
import { SLOT_COOKIE, parseDeviceSlots } from '#lib/play/slots.ts';
import { starsForHome } from '#lib/play/stars.ts';
import type { Level } from '#lib/play/types.ts';
import { slotStore } from '#lib/server/store.server.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params, url }) => {
	if (!isGameId(params.game)) redirect(303, '/');
	const device = parseDeviceSlots(cookies.get(SLOT_COOKIE));
	if (!device.activeId) redirect(303, '/');
	const store = slotStore();
	const [slot] = await store.listSlots([device.activeId]);
	if (!slot) redirect(303, '/');
	const records = await store.listRecords(slot.id);
	const next = nextUnfinishedLevel(records, params.game);
	const requested = Number(url.searchParams.get('level'));
	const level = (
		requested >= 1 && requested <= 10 && canReplay(records, params.game, requested as Level)
			? requested
			: next
	) as Level;
	const doneRaw = Number(url.searchParams.get('done'));
	const done = doneRaw >= 1 && doneRaw <= 10 ? (doneRaw as Level) : 0;
	return {
		game: params.game,
		level,
		language: copyLanguage(slot),
		artId: slot.artId,
		stars: starsForHome(records, params.game),
		next,
		done,
		free: url.searchParams.get('free') === '1' && params.game === 'paint',
		faster: url.searchParams.get('faster') === '1',
		firstFinish: url.searchParams.get('star') === '1'
	};
};

export const actions: Actions = {
	finish: async ({ cookies, params, request }) => {
		if (!isGameId(params.game)) redirect(303, '/');
		const device = parseDeviceSlots(cookies.get(SLOT_COOKIE));
		if (!device.activeId) redirect(303, '/');
		const form = await request.formData();
		const level = Number(form.get('level')) as Level;
		const timeMs = Math.max(1, Number(form.get('timeMs')) || 1);
		if (level < 1 || level > 10) return fail(400, { reason: 'level' });
		const store = slotStore();
		const records = await store.listRecords(device.activeId);
		const outcome = finishOutcome(records, params.game, level, timeMs);
		await store.insertRecord(playRecord(device.activeId, params.game, level, timeMs));
		const q = new URLSearchParams();
		q.set('done', String(level));
		if (outcome.faster) q.set('faster', '1');
		if (outcome.firstFinish) q.set('star', '1');
		redirect(303, `/play/${params.game}?${q}`);
	}
};

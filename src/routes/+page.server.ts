import { fail, redirect } from '@sveltejs/kit';
import { CATALOG } from '#lib/play/catalog.ts';
import { isLanguage } from '#lib/play/language.ts';
import { setSlotLanguage } from '#lib/play/language.ts';
import { starsForHome } from '#lib/play/stars.ts';
import {
	SLOT_COOKIE,
	activateSlot,
	erasePictureSlot,
	keepKnownSlots,
	markNoticeSeen,
	nestsFrom,
	parseDeviceSlots,
	serializeDeviceSlots,
	setPendingLanguage,
	startPictureSlot,
	type DeviceSlots
} from '#lib/play/slots.ts';
import { FRIEND_ART_IDS, type FriendArtId, type Language } from '#lib/play/types.ts';
import { slotStore } from '#lib/server/store.server.ts';
import type { Actions, PageServerLoad } from './$types';

const cookieOptions = { path: '/', httpOnly: true, sameSite: 'lax' as const, maxAge: 60 * 60 * 24 * 400 };

function readDevice(cookies: { get: (name: string) => string | undefined }): DeviceSlots {
	return parseDeviceSlots(cookies.get(SLOT_COOKIE));
}

function writeDevice(
	cookies: { set: (name: string, value: string, opts: typeof cookieOptions) => void },
	device: DeviceSlots
) {
	cookies.set(SLOT_COOKIE, serializeDeviceSlots(device), cookieOptions);
}

export const load: PageServerLoad = async ({ cookies, url }) => {
	let device = readDevice(cookies);
	const store = slotStore();
	const slots = await store.listSlots(device.ids);
	const synced = keepKnownSlots(device, slots);
	if (synced !== device) {
		writeDevice(cookies, synced);
		device = synced;
	}
	const active = slots.find((slot) => slot.id === device.activeId) ?? null;
	const records = active ? await store.listRecords(active.id) : [];
	return {
		noticeSeen: device.noticeSeen,
		showPictures: url.searchParams.get('pictures') === '1',
		activeId: active?.id ?? null,
		language: active?.language ?? device.pendingLanguage,
		nests: nestsFrom(device, slots),
		cottages: CATALOG.map((cottage) => ({
			...cottage,
			stars: starsForHome(records, cottage.id)
		}))
	};
};

export const actions: Actions = {
	go: async ({ cookies }) => {
		writeDevice(cookies, markNoticeSeen(readDevice(cookies)));
		redirect(303, '/');
	},
	create: async ({ cookies, request }) => {
		const form = await request.formData();
		const artId = String(form.get('artId') ?? '');
		if (!(FRIEND_ART_IDS as readonly string[]).includes(artId)) {
			return fail(400, { reason: 'friend' });
		}
		const device = readDevice(cookies);
		try {
			const started = await startPictureSlot(
				slotStore(),
				device,
				artId as FriendArtId,
				device.pendingLanguage
			);
			writeDevice(cookies, started.device);
		} catch (error) {
			const message = error instanceof Error ? error.message : 'create';
			return fail(400, { reason: message });
		}
		redirect(303, '/');
	},
	activate: async ({ cookies, request }) => {
		const form = await request.formData();
		writeDevice(cookies, activateSlot(readDevice(cookies), String(form.get('slotId') ?? '')));
		redirect(303, '/');
	},
	erase: async ({ cookies, request }) => {
		const form = await request.formData();
		const erased = await erasePictureSlot(slotStore(), readDevice(cookies), String(form.get('slotId') ?? ''));
		writeDevice(cookies, erased.device);
		redirect(303, '/');
	},
	language: async ({ cookies, request }) => {
		const form = await request.formData();
		const language = String(form.get('language') ?? '');
		if (!isLanguage(language)) return fail(400, { reason: 'language' });
		let device = setPendingLanguage(readDevice(cookies), language as Language);
		writeDevice(cookies, device);
		if (device.activeId) {
			const store = slotStore();
			const [slot] = await store.listSlots([device.activeId]);
			if (slot) await store.updateSlot(setSlotLanguage(slot, language as Language));
		}
		redirect(303, '/');
	}
};

import {
	FRIEND_ART_IDS,
	LANGUAGES,
	type FriendArtId,
	type Language,
	type PictureSlot,
	type PlayRecord
} from './types.ts';

export const MAX_PICTURE_SLOTS = 4;
export const SLOT_COOKIE = 'picture-slots';
export const LONG_PRESS_MS = 550;

const FORBIDDEN_FIELDS = ['name', 'email', 'photo', 'voice'] as const;
const SLOT_INPUT_FIELDS = ['artId', 'language', 'id'] as const;

export type DeviceSlots = {
	ids: string[];
	activeId: string | null;
	noticeSeen: boolean;
	pendingLanguage: Language;
};

export type SlotStore = {
	insertSlot(slot: PictureSlot): Promise<void>;
	updateSlot(slot: PictureSlot): Promise<void>;
	listSlots(ids: string[]): Promise<PictureSlot[]>;
	eraseSlot(id: string): Promise<void>;
	insertRecord(record: PlayRecord): Promise<void>;
	listRecords(slotId: string): Promise<PlayRecord[]>;
};

export const WRITTEN_NOTICE_EN =
	'This site remembers play on this device. It stores a picture, a language, and for each finished game: the game, the level, the time, and the date. Nothing else. No name, email, photo, or voice. A slot stays until a long-press, then a confirm, erases it, or until this browser forgets the id. There is no automatic wipe.';

export const WRITTEN_NOTICE_IT =
	'Questo sito ricorda il gioco su questo dispositivo. Salva un disegno, una lingua e, per ogni partita finita: il gioco, il livello, il tempo e la data. Nient’altro. Né nome, né email, né foto, né voce. Un posto resta finché una pressione lunga, poi una conferma, lo cancella, o finché questo browser dimentica l’id. Non c’è una cancellazione automatica.';

export function emptyDeviceSlots(): DeviceSlots {
	return { ids: [], activeId: null, noticeSeen: false, pendingLanguage: 'it' };
}

export function parseDeviceSlots(raw: string | undefined): DeviceSlots {
	if (!raw) return emptyDeviceSlots();
	try {
		const parsed = JSON.parse(raw) as Partial<DeviceSlots>;
		const ids = Array.isArray(parsed.ids)
			? parsed.ids.filter((id): id is string => typeof id === 'string').slice(0, MAX_PICTURE_SLOTS)
			: [];
		const activeId = typeof parsed.activeId === 'string' && ids.includes(parsed.activeId) ? parsed.activeId : null;
		return {
			ids,
			activeId,
			noticeSeen: parsed.noticeSeen === true,
			pendingLanguage: (LANGUAGES as readonly string[]).includes(String(parsed.pendingLanguage))
				? (parsed.pendingLanguage as Language)
				: 'it'
		};
	} catch {
		return emptyDeviceSlots();
	}
}

export function serializeDeviceSlots(device: DeviceSlots): string {
	return JSON.stringify(device);
}

export function createPictureSlot(input: {
	artId: string;
	language?: Language;
	id?: string;
}): PictureSlot {
	for (const key of Object.keys(input)) {
		if ((FORBIDDEN_FIELDS as readonly string[]).includes(key)) {
			throw new Error(`refused field ${key}: name, email, photo, and voice are not stored`);
		}
		if (!(SLOT_INPUT_FIELDS as readonly string[]).includes(key)) {
			throw new Error(`refused field ${key}: name, email, photo, and voice are not stored`);
		}
	}
	if (!(FRIEND_ART_IDS as readonly string[]).includes(input.artId)) {
		throw new Error('unknown friend');
	}
	return {
		id: input.id ?? crypto.randomUUID(),
		artId: input.artId as FriendArtId,
		language: input.language ?? 'it'
	};
}

export function addPictureSlot(device: DeviceSlots, slot: PictureSlot): DeviceSlots {
	if (!device.noticeSeen) {
		throw new Error('notice must be seen before a picture slot');
	}
	if (device.ids.length >= MAX_PICTURE_SLOTS) {
		throw new Error('already four picture slots');
	}
	return {
		ids: [...device.ids, slot.id],
		activeId: slot.id,
		noticeSeen: true,
		pendingLanguage: slot.language
	};
}

export function markNoticeSeen(device: DeviceSlots): DeviceSlots {
	return { ...device, noticeSeen: true };
}

export function setPendingLanguage(device: DeviceSlots, language: Language): DeviceSlots {
	return { ...device, pendingLanguage: language };
}

export function activateSlot(device: DeviceSlots, slotId: string): DeviceSlots {
	if (!device.ids.includes(slotId)) return device;
	return { ...device, activeId: slotId };
}

export function dropSlot(device: DeviceSlots, slotId: string): DeviceSlots {
	const ids = device.ids.filter((id) => id !== slotId);
	const activeId = device.activeId === slotId ? (ids[0] ?? null) : device.activeId;
	return { ...device, ids, activeId };
}

export function keepKnownSlots(device: DeviceSlots, slots: PictureSlot[]): DeviceSlots {
	const known = new Set(slots.map((slot) => slot.id));
	const ids = device.ids.filter((id) => known.has(id));
	const activeId = device.activeId && ids.includes(device.activeId) ? device.activeId : (ids[0] ?? null);
	if (ids.length === device.ids.length && activeId === device.activeId) return device;
	return { ...device, ids, activeId };
}

export function nestsFrom(device: DeviceSlots, slots: PictureSlot[]): Array<PictureSlot | null> {
	const byId = new Map(slots.map((slot) => [slot.id, slot]));
	const nests: Array<PictureSlot | null> = device.ids.map((id) => byId.get(id) ?? null);
	while (nests.length < MAX_PICTURE_SLOTS) nests.push(null);
	return nests.slice(0, MAX_PICTURE_SLOTS);
}

export function createMemorySlotStore(seed?: {
	slots?: PictureSlot[];
	records?: PlayRecord[];
}): SlotStore {
	const slots = new Map((seed?.slots ?? []).map((slot) => [slot.id, slot]));
	const records = seed?.records ?? [];
	return {
		async insertSlot(slot) {
			slots.set(slot.id, { id: slot.id, artId: slot.artId, language: slot.language });
		},
		async updateSlot(slot) {
			slots.set(slot.id, { id: slot.id, artId: slot.artId, language: slot.language });
		},
		async listSlots(ids) {
			return ids.flatMap((id) => {
				const slot = slots.get(id);
				return slot ? [slot] : [];
			});
		},
		async eraseSlot(id) {
			slots.delete(id);
			for (let i = records.length - 1; i >= 0; i--) {
				if (records[i]?.slotId === id) records.splice(i, 1);
			}
		},
		async insertRecord(record) {
			records.push(record);
		},
		async listRecords(slotId) {
			return records.filter((record) => record.slotId === slotId);
		}
	};
}

export async function startPictureSlot(
	store: SlotStore,
	device: DeviceSlots,
	artId: string,
	language: Language = 'it'
): Promise<{ slot: PictureSlot; device: DeviceSlots }> {
	const slot = createPictureSlot({ artId, language });
	const next = addPictureSlot(device, slot);
	await store.insertSlot(slot);
	return { slot, device: next };
}

export async function erasePictureSlot(
	store: SlotStore,
	device: DeviceSlots,
	slotId: string
): Promise<{ device: DeviceSlots }> {
	await store.eraseSlot(slotId);
	return { device: dropSlot(device, slotId) };
}

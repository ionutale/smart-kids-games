import { getMongoClient } from './mongo.server.ts';
import type { PictureSlot, PlayRecord } from '../play/types.ts';
import type { SlotStore } from '../play/slots.ts';

const DB = 'smart-kids-games';

export function createMongoSlotStore(): SlotStore {
	const db = () => getMongoClient().db(DB);

	return {
		async insertSlot(slot) {
			await db().collection('pictureSlots').insertOne({
				id: slot.id,
				artId: slot.artId,
				language: slot.language
			});
		},
		async updateSlot(slot) {
			await db().collection('pictureSlots').updateOne(
				{ id: slot.id },
				{ $set: { artId: slot.artId, language: slot.language } }
			);
		},
		async listSlots(ids) {
			if (ids.length === 0) return [];
			const found = await db()
				.collection<PictureSlot>('pictureSlots')
				.find({ id: { $in: ids } })
				.toArray();
			const byId = new Map(
				found.map((slot) => [
					slot.id,
					{ id: slot.id, artId: slot.artId, language: slot.language } satisfies PictureSlot
				])
			);
			return ids.flatMap((id) => {
				const slot = byId.get(id);
				return slot ? [slot] : [];
			});
		},
		async eraseSlot(id) {
			await db().collection('pictureSlots').deleteOne({ id });
			await db().collection('playRecords').deleteMany({ slotId: id });
		},
		async insertRecord(record) {
			await db().collection('playRecords').insertOne({
				slotId: record.slotId,
				game: record.game,
				level: record.level,
				timeMs: record.timeMs,
				date: record.date
			});
		},
		async listRecords(slotId) {
			const found = await db().collection<PlayRecord>('playRecords').find({ slotId }).toArray();
			return found.map((record) => ({
				slotId: record.slotId,
				game: record.game,
				level: record.level,
				timeMs: record.timeMs,
				date: record.date
			}));
		}
	};
}

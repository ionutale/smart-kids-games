import { MONGODB_URI } from '$app/env/private';
import { createMemorySlotStore } from '../play/slots.ts';
import { createMongoSlotStore } from './slots.server.ts';

const memoryStore = createMemorySlotStore();

export function slotStore() {
	return MONGODB_URI ? createMongoSlotStore() : memoryStore;
}

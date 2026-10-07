import { MongoClient } from 'mongodb';
import { attachDatabasePool } from '@vercel/functions';
import { MONGODB_URI } from '$app/env/private';

const poolOptions = {
	maxIdleTimeMS: 60_000,
	minPoolSize: 0
} as const;

let client: MongoClient | undefined;

export function getMongoClient(): MongoClient {
	if (!client) {
		client = new MongoClient(MONGODB_URI, poolOptions);
		attachDatabasePool(client);
	}
	return client;
}

import { CosmosClient, ItemResponse } from '@azure/cosmos'
import { always } from 'ramda'
import { createDBInstance } from './common'

export type Secret = {
	readonly id: string
	readonly secret: string
	readonly address: string
}

const SECRETS = {
	database: 'Authentication',
	container: 'Secrets',
}

const createPartitionKey = (id: string): string => id.slice(0, 1)

export const writer = (client: typeof CosmosClient) => async (
	data: Secret
): Promise<ItemResponse<Secret>> => {
	const partitionKey = createPartitionKey(data.id)
	const container = await createDBInstance(
		client,
		{ ...SECRETS, partitionKey },
		process.env
	)
	return container.items
		.create(data)
		.catch(
			always(((id) => container.item(id, partitionKey).replace(data))(data.id))
		)
}

export const reader = (client: typeof CosmosClient) => async (
	id: string
): Promise<ItemResponse<Secret>> => {
	const partitionKey = createPartitionKey(id)
	const container = await createDBInstance(
		client,
		{ ...SECRETS, partitionKey },
		process.env
	)
	return container.item(id, partitionKey).read()
}

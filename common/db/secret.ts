import { CosmosClient, ItemResponse } from '@azure/cosmos'
import { always } from 'ramda'
import { createDBInstance } from './common'
import { createPartitionKey } from './createPartitionKey'

export type Secret = {
	readonly id: string
	readonly secret: string
	readonly address: string
}

export type SecretWithPartition = Secret & {
	readonly partition: string
}

const SECRETS = {
	database: 'Authentication',
	container: 'Secrets',
}

const createPartitionValue = (id: string): string => id.slice(0, 1)
const partitionKey = createPartitionKey()

export const writer = (client: typeof CosmosClient) => async (
	data: Secret
): Promise<ItemResponse<SecretWithPartition>> => {
	const partition = createPartitionValue(data.id)
	const container = await createDBInstance(
		client,
		{ ...SECRETS, partitionKey },
		process.env
	)
	const item: SecretWithPartition = { ...data, ...{ partition } }
	return container.items
		.create(item)
		.catch(
			always(((id) => container.item(id, partition).replace(item))(item.id))
		)
}

export const reader = (client: typeof CosmosClient) => async (
	id: string
): Promise<ItemResponse<SecretWithPartition>> => {
	const partitionKey = createPartitionKey()
	const partition = createPartitionValue(id)
	const container = await createDBInstance(
		client,
		{ ...SECRETS, partitionKey },
		process.env
	)
	return container.item(id, partition).read()
}

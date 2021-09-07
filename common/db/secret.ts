import { CosmosClient, ItemResponse } from '@azure/cosmos'
import { always } from 'ramda'
import { createDBInstance } from './common'
import { withPartitionKey } from './withPartitionKey'

export type Secret = {
	readonly id: string
	readonly secret: string
	readonly address: string
}

export type SecretWithPartition = Secret & {
	readonly _partitionKey: string
}

const SECRETS = {
	database: 'Authentication',
	container: 'Secrets',
}

const createPartitionValue = (id: string): string => id.substr(id.length - 1)

export const writer =
	(client: typeof CosmosClient) =>
	async (data: Secret): Promise<ItemResponse<SecretWithPartition>> => {
		const partition = createPartitionValue(data.id)
		const container = await createDBInstance(client, SECRETS, process.env)
		const item: SecretWithPartition = withPartitionKey(data, partition)
		return container.items
			.create(item)
			.catch(
				always(((id) => container.item(id, partition).replace(item))(item.id))
			)
	}

export const reader =
	(client: typeof CosmosClient) =>
	async (id: string): Promise<ItemResponse<SecretWithPartition>> => {
		const partition = createPartitionValue(id)
		const container = await createDBInstance(client, SECRETS, process.env)
		return container.item(id, partition).read()
	}

import { CosmosClient, ItemResponse } from '@azure/cosmos'
import { always } from 'ramda'
import { createDBInstance } from '../../common/db/common'
import { createPartitionKey } from '../../common/db/createPartitionKey'

export type LastBlock = {
	readonly id: string
	readonly lastBlock: number
}

export type LastBlockWithPartition = LastBlock & {
	readonly id: string
	readonly partition: string
}

const LASTBLOCK = {
	database: 'Authentication',
	container: 'LastBlock',
}

const createPartitionValue = (id: string): string => id.slice(0, 3)
const partitionKey = createPartitionKey()

export const writer = (client: typeof CosmosClient) => async (
	data: LastBlock
): Promise<ItemResponse<LastBlockWithPartition>> => {
	const partition = createPartitionValue(data.id)
	const container = await createDBInstance(
		client,
		{ ...LASTBLOCK, partitionKey },
		process.env
	)
	const item: LastBlockWithPartition = { ...data, ...{ partition } }
	return container.items
		.create(item)
		.catch(
			always(((id) => container.item(id, partition).replace(item))(item.id))
		)
}

export const reader = (client: typeof CosmosClient) => async (
	address: string
): Promise<ItemResponse<LastBlockWithPartition>> => {
	const partition = createPartitionValue(address)
	const container = await createDBInstance(
		client,
		{ ...LASTBLOCK, partitionKey },
		process.env
	)
	return container.item(address, partition).read()
}

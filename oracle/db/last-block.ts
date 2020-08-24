import { CosmosClient, ItemResponse } from '@azure/cosmos'
import { always } from 'ramda'
import { createDBInstance } from '../../common/db/common'
import { withPartitionKey } from '../../common/db/withPartitionKey'

export type LastBlock = {
	readonly id: string
	readonly lastBlock: number
}

export type LastBlockWithPartition = LastBlock & {
	readonly _partitionKey: string
}

const LASTBLOCK = {
	database: 'Oraclize',
	container: 'LastBlock',
}

const createPartitionValue = (id: string): string => id.slice(0, 3)

export const writer = (client: typeof CosmosClient) => async (
	data: LastBlock
): Promise<ItemResponse<LastBlockWithPartition>> => {
	const partition = createPartitionValue(data.id)
	const container = await createDBInstance(client, LASTBLOCK, process.env)
	const item: LastBlockWithPartition = withPartitionKey(data, partition)
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
	const container = await createDBInstance(client, LASTBLOCK, process.env)
	return container.item(address, partition).read()
}

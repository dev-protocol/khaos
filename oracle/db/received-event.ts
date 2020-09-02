import { CosmosClient, ItemResponse } from '@azure/cosmos'
import { always } from 'ramda'
import { createDBInstance } from '../../common/db/common'
import { withPartitionKey } from '../../common/db/withPartitionKey'

export type ReceivedEvent = {
	readonly id: string
}

export type ReceivedEventWithPartition = ReceivedEvent & {
	readonly _partitionKey: string
}

const RECEIVEEVENT = {
	database: 'Oraclization',
	container: 'ReceivedEvent',
}

export const writer = (client: typeof CosmosClient) => async (
	data: ReceivedEvent,
	khaosId: string
): Promise<ItemResponse<ReceivedEventWithPartition>> => {
	const container = await createDBInstance(client, RECEIVEEVENT, process.env)
	const item: ReceivedEventWithPartition = withPartitionKey(data, khaosId)
	return container.items
		.create(item)
		.catch(always(((id) => container.item(id, khaosId).replace(item))(item.id)))
}

export const isAlreadyReceived = (client: typeof CosmosClient) => async (
	transactionHash: string,
	khaosId: string
): Promise<boolean> => {
	const container = await createDBInstance(client, RECEIVEEVENT, process.env)
	const record = await container.item(transactionHash, khaosId).read()
	return typeof record.resource === 'undefined' ? false : true
}

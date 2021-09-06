import { CosmosClient, ItemResponse } from '@azure/cosmos'
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

export const writer =
	(client: typeof CosmosClient) =>
	async (
		data: ReceivedEvent,
		khaosId: string
	): Promise<ItemResponse<ReceivedEventWithPartition>> => {
		const container = await createDBInstance(client, RECEIVEEVENT, process.env)
		const item: ReceivedEventWithPartition = withPartitionKey(data, khaosId)
		const record = await reader(client)(data.id, khaosId)
		return typeof record.resource === 'undefined'
			? container.items.create(item)
			: record
	}

export const isAlreadyReceived =
	(client: typeof CosmosClient) =>
	async (transactionHash: string, khaosId: string): Promise<boolean> => {
		const record = await reader(client)(transactionHash, khaosId)
		return typeof record.resource === 'undefined' ? false : true
	}

const reader =
	(client: typeof CosmosClient) =>
	async (
		transactionHash: string,
		khaosId: string
	): Promise<ItemResponse<ReceivedEventWithPartition>> => {
		const container = await createDBInstance(client, RECEIVEEVENT, process.env)
		const record = await container.item(transactionHash, khaosId).read()
		return record
	}

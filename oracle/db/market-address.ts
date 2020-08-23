import { CosmosClient, ItemResponse } from '@azure/cosmos'
import { always } from 'ramda'
import { createDBInstance } from '../../common/db/common'

export type Address = {
	readonly address: string
	readonly khaosId: string
	readonly network: string
}

const ADDRESS = {
	database: 'Authentication',
	container: 'ContractAddress',
}

export const reader = (client: typeof CosmosClient) => async (
	khaosId: string,
	network: string
): Promise<ItemResponse<Address>> => {
	const container = await createDBInstance(client, ADDRESS, process.env)
	return container.item(khaosId, network).read()
}

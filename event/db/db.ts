import { CosmosClient, ItemResponse } from '@azure/cosmos'
import { always } from 'ramda'
import { createDBInstance } from '../../common/db/common'

export type LastBlock = {
	readonly address: string
	readonly lastBlock: number
}

const LASTBLOCK = {
	database: 'Authentication',
	container: 'LastBlock',
}

export const writer = (client: typeof CosmosClient) => async (
	data: LastBlock
): Promise<ItemResponse<LastBlock>> => {
	const container = await createDBInstance(client, LASTBLOCK, process.env)
	return container.items
		.create(data)
		.catch(
			always(
				((address) => container.item(address, address).replace(data))(
					data.address
				)
			)
		)
}

export const reader = (client: typeof CosmosClient) => async (
	address: string
): Promise<ItemResponse<LastBlock>> => {
	const container = await createDBInstance(client, LASTBLOCK, process.env)
	return container.item(address, address).read()
}

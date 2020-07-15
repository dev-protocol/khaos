import { CosmosClient, ItemResponse } from '@azure/cosmos'
import { always } from 'ramda'
import { createDBInstance } from './/common'

export type Secret = {
	readonly id: string
	readonly secret: string
}

const SECRETS = {
	database: 'Authentication',
	container: 'Secrets',
}

export const writer = (client: typeof CosmosClient) => async (
	data: Secret
): Promise<ItemResponse<Secret>> => {
	const container = await createDBInstance(client, SECRETS, process.env)
	return container.items
		.create(data)
		.catch(always(((id) => container.item(id, id).replace(data))(data.id)))
}

export const reader = (client: typeof CosmosClient) => async (
	id: string
): Promise<ItemResponse<Secret>> => {
	const container = await createDBInstance(client, SECRETS, process.env)
	return container.item(id, id).read()
}

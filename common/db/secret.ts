import { CosmosClient, ItemResponse } from '@azure/cosmos'
import { createDBInstance } from './common'

export type Secret = {
	readonly id: string
	readonly secret: string
}

const SECRETS = {
	database: 'Authentication',
	container: 'Secrets',
}
export const readSecret = (client: typeof CosmosClient) => async (
	id: string
): Promise<ItemResponse<Secret>> => {
	const container = await createDBInstance(client, SECRETS, process.env)
	return container.item(id, id).read()
}

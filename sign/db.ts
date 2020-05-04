import { CosmosClient, Container, ItemResponse } from '@azure/cosmos'
import { tryCatch, always } from 'ramda'

export type Secret = {
	readonly id: string
	readonly secret: string
}

const SECRETS = {
	database: 'Authentication',
	container: 'Secrets',
}

const createDBInstance = async (
	Client: typeof CosmosClient,
	opts: {
		readonly database: string
		readonly container: string
	},
	env: NodeJS.ProcessEnv
): Promise<Container> => {
	const {
		KHAOS_COSMOS_ENDPOINT: endpoint = '',
		KHAOS_COSMOS_KEY: key = '',
	} = env
	const client = new Client({ endpoint, key })
	const { database } = await client.databases.createIfNotExists({
		id: opts.database,
	})
	const { container } = await database.containers.createIfNotExists({
		id: opts.container,
	})
	return container
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

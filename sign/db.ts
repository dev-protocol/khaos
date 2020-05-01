import { CosmosClient, Container, ItemResponse } from '@azure/cosmos'

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
	const db = await createDBInstance(client, SECRETS, process.env)
	const create = await db.items.create(data).catch((err: Error) => err)
	return create instanceof Error ? db.item(data.id).replace(data) : create
}

export const reader = (client: typeof CosmosClient) => async (
	id: string
): Promise<ItemResponse<Secret>> =>
	createDBInstance(client, SECRETS, process.env).then((container) =>
		container.item(id, id).read()
	)

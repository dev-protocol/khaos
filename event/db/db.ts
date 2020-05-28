import { CosmosClient, Container, ItemResponse } from '@azure/cosmos'
import { always } from 'ramda'

export type LastBlock = {
	readonly address: string
	readonly lastBlock: number
}

const LASTBLOCK = {
	database: 'Authentication',
	container: 'LastBlock',
}

// TODO あとで共通化
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

// TODO 共通化
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

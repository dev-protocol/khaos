import { CosmosClient, Container } from '@azure/cosmos'

export const createDBInstance = async (
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

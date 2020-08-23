import { reader } from '../db/market-address'
import { CosmosClient } from '@azure/cosmos'

export const getAddress = async (id: string, network: string): Promise<string | undefined> => {
	const record = await reader(CosmosClient)(id, network)
	return typeof record.resource === 'undefined' ? undefined : record.resource.address
}

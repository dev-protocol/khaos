import { reader } from '../db/last-block'
import { CosmosClient } from '@azure/cosmos'

export const getLastBlock = async (id: string): Promise<number> => {
	const record = await reader(CosmosClient)(id)
	return typeof record.resource === 'undefined' ? 0 : record.resource.lastBlock
}

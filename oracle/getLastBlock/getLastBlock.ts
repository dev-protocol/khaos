import { reader } from '../db/last-block'
import { CosmosClient } from '@azure/cosmos'

export const getLastBlock = async (address: string): Promise<number> => {
	const record = await reader(CosmosClient)(address)
	return typeof record.resource === 'undefined' ? 0 : record.resource.lastBlock
}

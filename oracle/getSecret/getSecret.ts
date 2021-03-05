import { CosmosClient, ItemResponse } from '@azure/cosmos'
import { reader, Secret } from './../../common/db/secret'
import { MarketQueryData } from './../../common/structs'

export type oracleArgInfo = {
	readonly secret?: ItemResponse<Secret>
	readonly eventData: MarketQueryData
}

export const getSecret = async (
	eventData: MarketQueryData
): Promise<oracleArgInfo> => {
	const isUndefined = typeof eventData.publicSignature === 'undefined'
	const secret = isUndefined ? undefined : await reader(CosmosClient)(eventData.publicSignature)
	return {
		secret,
		eventData,
	}
}

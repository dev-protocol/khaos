import { CosmosClient, ItemResponse } from '@azure/cosmos'
import { reader, Secret } from './../../common/db/secret'
import { MarketQueryData } from './../getData/getData'

export type oracleArgInfo = {
	readonly secret: ItemResponse<Secret>
	readonly eventData: MarketQueryData
}

export const getSecret = async (
	eventData: MarketQueryData
): Promise<oracleArgInfo> => {
	const secret = await reader(CosmosClient)(eventData.publicSignature)
	return {
		secret,
		eventData,
	}
}

import { CosmosClient, ItemResponse } from '@azure/cosmos'
import { reader, Secret } from './../../common/db/secret'
import { MarketEventData } from '../getData/getData'

export type oracleArgInfo = {
	readonly secret: ItemResponse<Secret>
	readonly eventData: MarketEventData
}

export const getSecret = async (
	eventData: MarketEventData
): Promise<oracleArgInfo> => {
	const secret = await reader(CosmosClient)(eventData.publicSignature)
	return {
		secret,
		eventData,
	}
}

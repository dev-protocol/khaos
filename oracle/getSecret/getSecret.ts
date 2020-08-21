import { CosmosClient, ItemResponse } from '@azure/cosmos'
import { reader, Secret } from './../../common/db/secret'
import { KhaosEventData } from '../getData/getData'

export type oracleArgInfo = {
	readonly secret: ItemResponse<Secret>
	readonly eventData: KhaosEventData
}

export const getSecret = async (
	eventData: KhaosEventData
): Promise<oracleArgInfo> => {
	const secret = await reader(CosmosClient)(eventData.publicSignature)
	return {
		secret,
		eventData,
	}
}

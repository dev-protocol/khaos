import { CosmosClient, ItemResponse } from '@azure/cosmos'
import { reader, Secret } from './../../common/db/secret'
import { KhaosEventData } from '../getData/getData'

export type oracleArgInfo = {
	readonly secret: ItemResponse<Secret>
	readonly json: any
}

export const getSecret = async (
	json: KhaosEventData
): Promise<oracleArgInfo> => {
	const secret = await reader(CosmosClient)(json.s)
	return {
		secret,
		json,
	}
}

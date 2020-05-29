import { CosmosClient, ItemResponse } from '@azure/cosmos'
import { readSecret, Secret } from './../../common/db/secret'

export type oracleArgInfo = {
	readonly secret: ItemResponse<Secret>
	readonly json: any
}

export const getSecret = async (json: any): Promise<oracleArgInfo> => {
	const secret = await readSecret(CosmosClient)(json.s)
	const result: oracleArgInfo = {
		secret: secret,
		json: json,
	}
	return result
}

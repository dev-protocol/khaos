import { CosmosClient, ItemResponse } from '@azure/cosmos'
import { whenDefined } from '@devprotocol/util-ts'
import { reader, Secret } from './../../common/db/secret'
import { MarketQueryData } from './../../common/structs'

export type oracleArgInfo = {
	readonly secret?: ItemResponse<Secret>
	readonly eventData: MarketQueryData
}

export const getSecret = async (
	eventData: MarketQueryData
): Promise<oracleArgInfo> => {
	const secret = await whenDefined(
		eventData.publicSignature,
		reader(CosmosClient)
	)
	return {
		secret,
		eventData,
	}
}

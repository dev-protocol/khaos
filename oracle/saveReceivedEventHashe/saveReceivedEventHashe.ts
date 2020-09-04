import { MarketQueryData } from '../../common/structs'
import {
	writer,
	ReceivedEvent,
	ReceivedEventWithPartition,
} from '../db/received-event'
import { CosmosClient, ItemResponse } from '@azure/cosmos'

export const saveReceivedEventHashe = (khaosId: string) => async (
	data: MarketQueryData
): Promise<ItemResponse<ReceivedEventWithPartition>> => {
	const insertData: ReceivedEvent = {
		id: data.transactionhash,
	}
	// eslint-disable-next-line functional/no-expression-statement
	return await writer(CosmosClient)(insertData, khaosId)
}

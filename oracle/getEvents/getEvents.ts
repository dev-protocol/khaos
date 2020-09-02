import { ethers } from 'ethers'
import { whenDefined } from '../../common/util/whenDefined'
import { isAlreadyReceived } from './../db/received-event'
import { CosmosClient } from '@azure/cosmos'

export const getEvents = async (
	marketBehavior: ethers.Contract,
	firstBlock: number,
	lastBlock: number,
	khaosId: string
): Promise<readonly ethers.Event[] | undefined> => {
	const filter = whenDefined(marketBehavior.filters.Query, (query) => query())
	const queryEvents = await whenDefined(filter, (filt) =>
		marketBehavior.queryFilter(filt, firstBlock, lastBlock)
	)
	const validEvents = await whenDefined(queryEvents, (events) =>
		events.filter((event) => isValid(event, khaosId))
	)
	return validEvents
}

const isValid = async (
	event: ethers.Event,
	khaosId: string
): Promise<boolean> => {
	const alreadyReceived = await isAlreadyReceived(CosmosClient)(
		event.transactionHash,
		khaosId
	)
	// eslint-disable-next-line functional/no-expression-statement
	return !alreadyReceived
}

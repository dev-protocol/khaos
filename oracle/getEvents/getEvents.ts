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
		filterAsync(events, isValid(khaosId))
	)
	return validEvents
}

const isValid = (khaosId: string) => async (
	event: ethers.Event
): Promise<boolean> => {
	const alreadyReceived = await isAlreadyReceived(CosmosClient)(
		event.transactionHash,
		khaosId
	)
	return !alreadyReceived
}

function mapAsync<T, U>(
	array: readonly T[],
	callbackfn: (value: T, index: number, array: readonly T[]) => Promise<U>
): Promise<readonly U[]> {
	return Promise.all(array.map(callbackfn))
}

async function filterAsync<T>(
	array: readonly T[],
	callbackfn: (value: T, index: number, array: readonly T[]) => Promise<boolean>
): Promise<readonly T[]> {
	const filterMap = await mapAsync(array, callbackfn)
	return array.filter((value, index) => filterMap[index])
}

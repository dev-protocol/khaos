import { Context } from '@azure/functions'
import { ethers } from 'ethers'
import { whenDefined } from '@devprotocol/util-ts'
import { isAlreadyReceived } from './../db/received-event'
import { CosmosClient } from '@azure/cosmos'

export const getEvents = async (
	context: Context,
	eventContract: ethers.Contract,
	firstBlock: number,
	lastBlock: number,
	khaosId: string,
	eventName: string
): Promise<readonly ethers.Event[] | undefined> => {
	const filter = whenDefined(eventContract.filters[eventName], (ev) => ev())
	const queryEvents = await whenDefined(filter, (filt) =>
		eventContract.queryFilter(filt, firstBlock, lastBlock)
	)
	// eslint-disable-next-line functional/no-expression-statement
	context.log.info(`id:${khaosId} event count before filtering:${queryEvents?.length}`)
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

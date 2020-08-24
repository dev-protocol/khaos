/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import test from 'ava'
import { getEvents } from './getEvents'
import { ethers } from 'ethers'

const tmp = async (): Promise<readonly ethers.Event[]> => {
	return [
		{
			blockNumber: 1,
			blockHash: 'dummy-value1',
		} as any,
		{
			blockNumber: 2,
			blockHash: 'dummy-value2',
		} as any,
	]
}

const dummyConstract = {
	filters: {
		Query: () => {
			return {}
		},
	},
	queryFilter: tmp,
}

test('event information is coming back.', async (t) => {
	const events = await getEvents(dummyConstract as any, 0, 100)
	t.is(events.length, 2)
	t.is(events[0].blockNumber, 1)
	t.is(events[0].blockHash, 'dummy-value1')
	t.is(events[1].blockNumber, 2)
	t.is(events[1].blockHash, 'dummy-value2')
})

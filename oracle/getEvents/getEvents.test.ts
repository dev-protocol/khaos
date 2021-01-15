/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import test from 'ava'
import { getEvents } from './getEvents'
import { ethers } from 'ethers'
import { stub } from 'sinon'
import * as received from '../db/received-event'

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

test.serial('event information is coming back.', async (t) => {
	const stubbedReader = stub(
		received,
		'isAlreadyReceived'
	).callsFake(() => async () => false)
	const events = await getEvents(
		dummyConstract as any,
		0,
		100,
		'example',
		'Query'
	).then((res) => (res as unknown) as readonly ethers.Event[])
	t.is(events.length, 2)
	t.is(events[0].blockNumber, 1)
	t.is(events[0].blockHash, 'dummy-value1')
	t.is(events[1].blockNumber, 2)
	t.is(events[1].blockHash, 'dummy-value2')
	stubbedReader.restore()
})

test.serial(
	'already received event information is not coming back.',
	async (t) => {
		const stubbedReader = stub(
			received,
			'isAlreadyReceived'
		).callsFake(() => async () => true)
		const events = await getEvents(
			dummyConstract as any,
			0,
			100,
			'example',
			'Query'
		).then((res) => (res as unknown) as readonly ethers.Event[])
		t.is(events.length, 0)
		stubbedReader.restore()
	}
)

test.serial('Returns undefined when `Query` not found.', async (t) => {
	const events = await getEvents(
		{
			filters: {
				query: () => {
					return {}
				},
			},
			queryFilter: tmp,
		} as any,
		0,
		100,
		'example',
		'Query'
	)
	t.is(events, undefined)
})

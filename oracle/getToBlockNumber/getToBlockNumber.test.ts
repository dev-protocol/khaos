/* eslint-disable functional/immutable-data */
import test from 'ava'
import { getToBlockNumber } from './getToBlockNumber'

const dummyProvider = {
	getBlockNumber: async (): Promise<number> => {
		return 100
	},
}

test('return undefined if provider is undefined.', async (t) => {
	const result = await getToBlockNumber(undefined as any)
	t.is(typeof result, 'undefined')
})

test('The current block number is returned.', async (t) => {
	const result = await getToBlockNumber(dummyProvider as any)
	t.is(result, 100)
})

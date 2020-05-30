import test from 'ava'
import { getData } from './getData'

test('Returning the contents of _data as a json object', async (t) => {
	const testData = {
		returnValues: {
			_data:
				'{"s": "public-signature", "a": "dummy-address", "k": "unique-key", "i": "khaos-id"}',
		},
		raw: {
			data: 'dummy-data',
			topics: [],
		},
		event: 'Query',
		signature: 'dummy-signature',
		logIndex: 5,
		transactionIndex: 10,
		transactionHash: 'dummy-transactin-hash',
		blockHash: 'dummy-block-hash',
		blockNumber: 100,
		address: 'dummy-address',
	}
	const result = await getData(testData)
	t.is(result.s, 'public-signature')
	t.is(result.a, 'dummy-address')
	t.is(result.k, 'unique-key')
	t.is(result.i, 'khaos-id')
})

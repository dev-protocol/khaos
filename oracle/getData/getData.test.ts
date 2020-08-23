import test from 'ava'
import { getData } from './getData'

test('Returning the contents of _data as a json object', async (t) => {
	const data = {
		publicSignature: 'dummy-public-signature',
		packagename: 'dummy-package'
	}

	const testData = {
		blockNumber: 1500000,
		blockHash: 'dummy-block-hash',
		transactionIndex: 18,
		removed: false,
		address: 'dummy-address',
		data: JSON.stringify(data),
		topics: ['topics1'],
		transactionHash: 'dumy-transaction-hash',
		logIndex: 5,
	}
	const result = await getData(testData as any)
	t.is(result.publicSignature, 'dummy-public-signature')
	t.is(result.allData.packagename, 'dummy-package')
	t.is(result.allData.publicSignature, 'dummy-public-signature')
})

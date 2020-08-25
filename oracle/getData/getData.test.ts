import test from 'ava'
import { getData } from './getData'

test('Returning the contents of _data as a json object', async (t) => {
	const args = {
		publicSignature: 'dummy-public-signature',
		packagename: 'dummy-package',
	}

	const testData = {
		blockNumber: 1500000,
		blockHash: 'dummy-block-hash',
		transactionIndex: 18,
		removed: false,
		address: 'dummy-address',
		data: '000099999',
		topics: ['topics1'],
		transactionHash: 'dumy-transaction-hash',
		logIndex: 5,
		args: args as any,
	}
	const result = await getData(testData as any)
	t.is(result.publicSignature, 'dummy-public-signature')
	t.is(result.allData['packagename'], 'dummy-package')
	t.is(result.allData['publicSignature'], 'dummy-public-signature')
})

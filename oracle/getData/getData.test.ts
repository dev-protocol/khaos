import test from 'ava'
import { getData } from './getData'

test('Returning the contents of _data as a json object', async (t) => {
	const data = {
		publicSignature: 'dummy-public-signature',
		key: '0eewifdnqw823nrqe9ad',
		additionalData:
			'{"property": "0x1D415aa39D647834786EB9B5a333A50e9935b796", "repository": "user/repo_name"}',
	}
	const testData = {
		returnValues: {
			_data: JSON.stringify(data),
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
	t.is(result.key, '0eewifdnqw823nrqe9ad')
	t.is(result.publicSignature, 'dummy-public-signature')
	const additionalData = JSON.parse(result.additionalData)
	t.is(additionalData.property, '0x1D415aa39D647834786EB9B5a333A50e9935b796')
	t.is(additionalData.repository, 'user/repo_name')
})

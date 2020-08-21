import test from 'ava'
import { getData } from './getData'
import { ethers } from 'ethers'

test('Returning the contents of _data as a json object', async (t) => {
	const key = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('user/repo_name'))
	const data = {
		publicSignature: 'dummy-public-signature',
		key: key,
		additionalData:
			'{"property": "0x1D415aa39D647834786EB9B5a333A50e9935b796", "repository": "user/repo_name"}',
	}
	const abi = new ethers.utils.AbiCoder()
	const encoded = abi.encode(
		['tuple(bytes32, string, string)'],
		[[data.key, data.publicSignature, data.additionalData]]
	)
	const testData = {
		returnValues: {
			_data: encoded,
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
	t.is(result.key, key)
	t.is(result.publicSignature, 'dummy-public-signature')
	const additionalData = JSON.parse(result.additionalData)
	t.is(additionalData.property, '0x1D415aa39D647834786EB9B5a333A50e9935b796')
	t.is(additionalData.repository, 'user/repo_name')
})

import test from 'ava'
import { ethers } from 'ethers'
import oraclize from './oraclize'
import { KhaosEventData } from './../../oracle/getData/getData'

test('Successful authentication', async (t) => {
	const key = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('xxx/yyy'))

	const data: KhaosEventData = {
		publicSignature: 'dummy-public-signature',
		key: key,
		additionalData:
			'{"property": "0x1D415aa39D647834786EB9B5a333A50e9935b796", "repository": "xxx/yyy"}',
	}
	const res = await oraclize(
		{ message: 'xxx/yyy', address: '0x1234', id: data.publicSignature },
		data
	)
	const abi = new ethers.utils.AbiCoder()
	const result = abi.decode(['tuple(bytes32, string)'], res)
	t.is(result[0][0], key)
	const addicionalData = JSON.parse(result[0][1])
	t.is(addicionalData.repository, 'xxx/yyy')
	t.is(addicionalData.property, '0x1D415aa39D647834786EB9B5a333A50e9935b796')
	t.is(addicionalData.status, 0)
	t.is(addicionalData.message, 'success')
})

test('Returns error when the passed repository is not authorized', async (t) => {
	const key = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('yyy/zzz'))

	const data: KhaosEventData = {
		publicSignature: 'dummy-public-signature',
		key: key,
		additionalData:
			'{"property": "0x1D415aa39D647834786EB9B5a333A50e9935b796", "repository": "yyy/zzz"}',
	}
	const res = await oraclize(
		{ message: 'xxx/yyy', address: '0x1234', id: data.publicSignature },
		data
	)
	const abi = new ethers.utils.AbiCoder()
	const result = abi.decode(['tuple(bytes32, string)'], res)
	t.is(result[0][0], key)
	const addicionalData = JSON.parse(result[0][1])
	t.is(addicionalData.repository, 'yyy/zzz')
	t.is(addicionalData.property, '0x1D415aa39D647834786EB9B5a333A50e9935b796')
	t.is(addicionalData.status, 2)
	t.is(addicionalData.message, 'error')
})

test('Returns error when the passed additionalData is invalid json', async (t) => {
	const key = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('yyy/zzz'))

	const data: KhaosEventData = {
		publicSignature: 'dummy-public-signature',
		key: key,
		additionalData:
			'property": "0x1D415aa39D647834786EB9B5a333A50e9935b796", "repository": "yyy/zzz"}',
	}
	const res = await oraclize(
		{ message: 'xxx/yyy', address: '0x1234', id: data.publicSignature },
		data
	)
	const abi = new ethers.utils.AbiCoder()
	const result = abi.decode(['tuple(bytes32, string)'], res)
	t.is(result[0][0], key)
	const addicionalData = JSON.parse(result[0][1])
	t.is(addicionalData.repository, undefined)
	t.is(addicionalData.property, undefined)
	t.is(addicionalData.status, 2)
	t.is(addicionalData.message, 'error')
})

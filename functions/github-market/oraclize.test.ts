import test from 'ava'
import { ethers } from 'ethers'
import oraclize from './oraclize'

test('Successful authentication(personal).', async (t) => {
	const key = ethers.utils.keccak256(
		ethers.utils.toUtf8Bytes('Akira-Taniguchi/cloud_lib')
	)

	const res = await oraclize(
		'eabe72317f1de4c9369f211e99b1c0190c8b5bb3',
		'',
		'dummy-public-signature'
	)
	const abi = new ethers.utils.AbiCoder()
	const result = abi.decode(['tuple(bytes32, string)'], res)
	t.is(result[0][0], key)
	const addicionalData = JSON.parse(result[0][1])
	t.is(addicionalData.repository, 'Akira-Taniguchi/cloud_lib')
	t.is(addicionalData.property, '0x1D415aa39D647834786EB9B5a333A50e9935b796')
	t.is(addicionalData.status, 0)
	t.is(addicionalData.message, 'success')
})

test('Successful authentication(organization).', async (t) => {
	const key = ethers.utils.keccak256(
		ethers.utils.toUtf8Bytes('dev-protocol/protocol')
	)

	const res = await oraclize(
		'eabe72317f1de4c9369f211e99b1c0190c8b5bb3',
		'',
		'dummy-public-signature'
	)
	const abi = new ethers.utils.AbiCoder()
	const result = abi.decode(['tuple(bytes32, string)'], res)
	t.is(result[0][0], key)
	const addicionalData = JSON.parse(result[0][1])
	t.is(addicionalData.repository, 'dev-protocol/protocol')
	t.is(addicionalData.property, '0x1D415aa39D647834786EB9B5a333A50e9935b796')
	t.is(addicionalData.status, 0)
	t.is(addicionalData.message, 'success')
})

test('Nonexistent repository.', async (t) => {
	const key = ethers.utils.keccak256(
		ethers.utils.toUtf8Bytes('Akira-Taniguchi/hogehoge')
	)
	const res = await oraclize(
		'eabe72317f1de4c9369f211e99b1c0190c8b5bb3',
		'',
		'dummy-public-signature'
	)
	const abi = new ethers.utils.AbiCoder()
	const result = abi.decode(['tuple(bytes32, string)'], res)
	t.is(result[0][0], key)
	const addicionalData = JSON.parse(result[0][1])
	t.is(addicionalData.repository, 'Akira-Taniguchi/hogehoge')
	t.is(addicionalData.property, '0x1D415aa39D647834786EB9B5a333A50e9935b796')
	t.is(addicionalData.status, 2)
	t.is(
		addicionalData.message,
		"Could not resolve to a Repository with the name 'Akira-Taniguchi/hogehoge'."
	)
})

test('Nonexistent user.', async (t) => {
	const key = ethers.utils.keccak256(
		ethers.utils.toUtf8Bytes('hugehugehugehugehugahugahugahuga/cloud_lib')
	)

	const res = await oraclize(
		'eabe72317f1de4c9369f211e99b1c0190c8b5bb3',
		'',
		'dummy-public-signature'
	)
	const abi = new ethers.utils.AbiCoder()
	const result = abi.decode(['tuple(bytes32, string)'], res)
	t.is(result[0][0], key)
	const addicionalData = JSON.parse(result[0][1])
	t.is(addicionalData.repository, 'hugehugehugehugehugahugahugahuga/cloud_lib')
	t.is(addicionalData.property, '0x1D415aa39D647834786EB9B5a333A50e9935b796')
	t.is(addicionalData.status, 2)
	t.is(
		addicionalData.message,
		"Could not resolve to a Repository with the name 'hugehugehugehugehugahugahugahuga/cloud_lib'."
	)
})

test('Illegal token.', async (t) => {
	const key = ethers.utils.keccak256(
		ethers.utils.toUtf8Bytes('Akira-Taniguchi/cloud_lib')
	)

	const res = await oraclize(
		'eabe72317f1de4c9369f211e99b1c0190c8b5b3',
		'',
		'dummy-public-signature'
	)
	const abi = new ethers.utils.AbiCoder()
	const result = abi.decode(['tuple(bytes32, string)'], res)
	t.is(result[0][0], key)
	const addicionalData = JSON.parse(result[0][1])
	t.is(addicionalData.repository, 'Akira-Taniguchi/cloud_lib')
	t.is(addicionalData.property, '0x1D415aa39D647834786EB9B5a333A50e9935b796')
	t.is(addicionalData.status, 2)
	t.is(addicionalData.message, 'http error')
})

test('not admin.', async (t) => {
	const key = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('hhatto/kamasu'))

	const res = await oraclize(
		'eabe72317f1de4c9369f211e99b1c0190c8b5bb3',
		'',
		'dummy-public-signature'
	)
	const abi = new ethers.utils.AbiCoder()
	const result = abi.decode(['tuple(bytes32, string)'], res)
	t.is(result[0][0], key)
	const addicionalData = JSON.parse(result[0][1])
	t.is(addicionalData.repository, 'hhatto/kamasu')
	t.is(addicionalData.property, '0x1D415aa39D647834786EB9B5a333A50e9935b796')
	t.is(addicionalData.status, 1)
	t.is(addicionalData.message, 'not admin')
})

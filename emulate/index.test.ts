/* eslint-disable functional/no-promise-reject */
import test from 'ava'
import { BigNumber } from 'ethers'
import { fake, stub } from 'sinon'
import * as compute from '../oracle/compute/compute'
import * as createContract from '../oracle/createContract/createContract'
import * as estimateTransaction from '../oracle/estimateTransaction/estimateTransaction'
import emulate from './index'

test.serial('Returns the results of the `compute` function', async (t) => {
	const computeFake = fake(
		() =>
			Promise.resolve({
				packed: { data: { name: 'callback', args: [1, 2, 3] } },
			}) as any
	)
	const estimateTransactionFake = fake(() =>
		Promise.resolve(BigNumber.from('123456'))
	)
	const factoryStub = stub(compute, 'compute').callsFake(() => computeFake)
	const createContractStub = stub(createContract, 'createContract').callsFake(
		() => Promise.resolve(['just a test instance']) as any
	)
	const factoryEstimateTransactionStub = stub(
		estimateTransaction,
		'estimateTransaction'
	).callsFake(() => estimateTransactionFake)
	const res = await emulate({} as any, {
		params: { id: 'test_id' },
		body: { network: 'testnet', event: { myParam: 1 } },
	})
	t.deepEqual(factoryStub.getCall(0).args, [{} as any, 'test_id', 'testnet'])
	t.deepEqual(computeFake.getCall(0).args, [{ myParam: 1 }])
	t.deepEqual(createContractStub.getCall(0).args, [{}, 'test_id', 'testnet'] as any)
	t.deepEqual(factoryEstimateTransactionStub.getCall(0).args, [
		'just a test instance',
	] as any)
	t.deepEqual(estimateTransactionFake.getCall(0).args, ['callback', [1, 2, 3]])
	t.deepEqual(res, {
		status: 200,
		body: {
			data: {
				name: 'callback',
				args: [1, 2, 3],
				gasLimit: '123456',
				expectedTransaction: { gasLimit: '123456', success: true },
			},
		},
	})

	factoryStub.restore()
	createContractStub.restore()
	factoryEstimateTransactionStub.restore()
})

test.serial(
	'Returns 400 when throw error from the `compute` function',
	async (t) => {
		const computeFake = fake(() => Promise.reject('test'))
		const estimateTransactionFake = fake(() =>
			Promise.resolve(BigNumber.from('123456'))
		)
		const factoryStub = stub(compute, 'compute').callsFake(() => computeFake)
		const createContractStub = stub(createContract, 'createContract').callsFake(
			() => Promise.resolve(['just a test']) as any
		)
		const factoryEstimateTransactionStub = stub(
			estimateTransaction,
			'estimateTransaction'
		).callsFake(() => estimateTransactionFake)
		const res = await emulate({} as any, {
			params: { id: 'test_id' },
			body: { network: 'testnet', event: { myParam: 1 } },
		})
		t.deepEqual(factoryStub.getCall(0).args, [{} as any, 'test_id', 'testnet'])
		t.deepEqual(computeFake.getCall(0).args, [{ myParam: 1 }])
		t.deepEqual(createContractStub.getCall(0).args, [
			{},
			'test_id',
			'testnet',
		] as any)
		t.deepEqual(factoryEstimateTransactionStub.getCalls().length, 0)
		t.deepEqual(estimateTransactionFake.getCalls().length, 0)
		t.deepEqual(res, {
			status: 400,
			body: {
				data: { expectedTransaction: { gasLimit: undefined, success: false } },
			},
		})

		factoryStub.restore()
		createContractStub.restore()
		factoryEstimateTransactionStub.restore()
	}
)

test.serial(
	'Returns 200 but `data.gasLimit` is undefined when throw error from the `createContract` function',
	async (t) => {
		const computeFake = fake(
			() =>
				Promise.resolve({
					packed: { data: { name: 'callback', args: [1, 2, 3] } },
				}) as any
		)
		const estimateTransactionFake = fake(() =>
			Promise.resolve(BigNumber.from('123456'))
		)
		const factoryStub = stub(compute, 'compute').callsFake(() => computeFake)
		const createContractStub = stub(
			createContract,
			'createContract'
		).callsFake(() => Promise.reject('test'))
		const factoryEstimateTransactionStub = stub(
			estimateTransaction,
			'estimateTransaction'
		).callsFake(() => estimateTransactionFake)
		const res = await emulate({} as any, {
			params: { id: 'test_id' },
			body: { network: 'testnet', event: { myParam: 1 } },
		})
		t.deepEqual(factoryStub.getCall(0).args, [{} as any, 'test_id', 'testnet'])
		t.deepEqual(computeFake.getCall(0).args, [{ myParam: 1 }])
		t.deepEqual(createContractStub.getCall(0).args, [
			{},
			'test_id',
			'testnet',
		] as any)
		t.deepEqual(factoryEstimateTransactionStub.getCalls().length, 0)
		t.deepEqual(estimateTransactionFake.getCalls().length, 0)
		t.deepEqual(res, {
			status: 200,
			body: {
				data: {
					name: 'callback',
					args: [1, 2, 3],
					gasLimit: undefined,
					expectedTransaction: { gasLimit: undefined, success: false },
				},
			},
		})

		factoryStub.restore()
		createContractStub.restore()
		factoryEstimateTransactionStub.restore()
	}
)

test.serial(
	'Returns 200 but `data.gasLimit` is undefined when throw error from the `estimateTransaction` function',
	async (t) => {
		const computeFake = fake(
			() =>
				Promise.resolve({
					packed: { data: { name: 'callback', args: [1, 2, 3] } },
				}) as any
		)
		const estimateTransactionFake = fake(() =>
			Promise.reject(new Error('test'))
		)
		const factoryStub = stub(compute, 'compute').callsFake(() => computeFake)
		const createContractStub = stub(createContract, 'createContract').callsFake(
			() => Promise.resolve(['just a test instance']) as any
		)
		const factoryEstimateTransactionStub = stub(
			estimateTransaction,
			'estimateTransaction'
		).callsFake(() => estimateTransactionFake)
		const res = await emulate({} as any, {
			params: { id: 'test_id' },
			body: { network: 'testnet', event: { myParam: 1 } },
		})
		t.deepEqual(factoryStub.getCall(0).args, [{} as any, 'test_id', 'testnet'])
		t.deepEqual(computeFake.getCall(0).args, [{ myParam: 1 }])
		t.deepEqual(createContractStub.getCall(0).args, [
			{},
			'test_id',
			'testnet',
		] as any)
		t.deepEqual(factoryEstimateTransactionStub.getCall(0).args, [
			'just a test instance',
		] as any)
		t.deepEqual(estimateTransactionFake.getCall(0).args, [
			'callback',
			[1, 2, 3],
		])
		t.deepEqual(res, {
			status: 200,
			body: {
				data: {
					name: 'callback',
					args: [1, 2, 3],
					gasLimit: undefined,
					expectedTransaction: { gasLimit: undefined, success: false },
				},
			},
		})

		factoryStub.restore()
		createContractStub.restore()
		factoryEstimateTransactionStub.restore()
	}
)

test.serial(
	'Returns 200 but `data.gasLimit` is undefined when the result of `estimateTransaction` function is undefined',
	async (t) => {
		const computeFake = fake(
			() =>
				Promise.resolve({
					packed: { data: { name: 'callback', args: [1, 2, 3] } },
				}) as any
		)
		const estimateTransactionFake = fake(() => Promise.resolve(undefined))
		const factoryStub = stub(compute, 'compute').callsFake(() => computeFake)
		const createContractStub = stub(createContract, 'createContract').callsFake(
			() => Promise.resolve(['just a test instance']) as any
		)
		const factoryEstimateTransactionStub = stub(
			estimateTransaction,
			'estimateTransaction'
		).callsFake(() => estimateTransactionFake)
		const res = await emulate({} as any, {
			params: { id: 'test_id' },
			body: { network: 'testnet', event: { myParam: 1 } },
		})
		t.deepEqual(factoryStub.getCall(0).args, [{} as any, 'test_id', 'testnet'])
		t.deepEqual(computeFake.getCall(0).args, [{ myParam: 1 }])
		t.deepEqual(createContractStub.getCall(0).args, [
			{},
			'test_id',
			'testnet',
		] as any)
		t.deepEqual(factoryEstimateTransactionStub.getCall(0).args, [
			'just a test instance',
		] as any)
		t.deepEqual(estimateTransactionFake.getCall(0).args, [
			'callback',
			[1, 2, 3],
		])
		t.deepEqual(res, {
			status: 200,
			body: {
				data: {
					name: 'callback',
					args: [1, 2, 3],
					gasLimit: undefined,
					expectedTransaction: { gasLimit: undefined, success: false },
				},
			},
		})

		factoryStub.restore()
		createContractStub.restore()
		factoryEstimateTransactionStub.restore()
	}
)

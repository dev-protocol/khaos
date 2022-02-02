import test from 'ava'
import sinon from 'sinon'
import * as estimateTransaction from '../estimateTransaction/estimateTransaction'
import { sendContractMethod } from './sendContractMethod'
import * as gas from './../gas/gas'
import { Transaction } from 'ethers'

const tmp = async (): Promise<any> => {
	return {
		hash: '0xdummy',
	}
}

const dummyConstract = {
	khaosCallback: tmp,
}

test.serial('returns event information', async (t) => {
	// eslint-disable-next-line functional/immutable-data
	process.env.KHAOS_EGS_TOKEN = 'egs_token'
	const stub = sinon
		.stub(estimateTransaction, 'estimateTransaction')
		.callsFake(() => async () => Promise.resolve('123456'))
	const result = await sendContractMethod(dummyConstract as any)(
		'khaosCallback',
		['test', 0]
	)
	t.deepEqual(result, {
		hash: '0xdummy',
	} as any)
	stub.restore()
})

test.serial(
	'run ethgas when the process.env.KHAOS_EGS_TOKEN is exists',
	async (t) => {
		// eslint-disable-next-line functional/immutable-data
		process.env.KHAOS_EGS_TOKEN = 'egs_token'
		const stub = sinon
			.stub(estimateTransaction, 'estimateTransaction')
			.callsFake(() => async () => Promise.resolve('123456'))
		const stubEthGas = sinon
			.stub(gas, 'ethgas')
			.callsFake(() => async () => ({ fastest: 123456 } as any))
		const result = await sendContractMethod(dummyConstract as any)(
			'khaosCallback',
			['test', 0]
		)
		t.deepEqual(result, {
			hash: '0xdummy',
		} as any)
		t.true(stubEthGas.called)
		stub.restore()
		stubEthGas.restore()
	}
)

test.serial(
	'run Contract.provider.getGasPrice when the process.env.KHAOS_EGS_TOKEN is not exists',
	async (t) => {
		// eslint-disable-next-line functional/immutable-data
		delete process.env.KHAOS_EGS_TOKEN
		const stubContract = {
			khaosCallback: tmp,
			provider: {
				getGasPrice: sinon.fake.returns(() => Promise.resolve('123456')),
			},
		}
		const stub = sinon
			.stub(estimateTransaction, 'estimateTransaction')
			.callsFake(() => async () => Promise.resolve('123456'))
		const result = await sendContractMethod(stubContract as any)(
			'khaosCallback',
			['test', 0]
		)
		t.deepEqual(result, {
			hash: '0xdummy',
		} as any)
		t.true(stubContract.provider.getGasPrice.called)
		stub.restore()
	}
)

test.serial('returns undefined when estimatation is failed', async (t) => {
	// eslint-disable-next-line functional/immutable-data
	process.env.KHAOS_EGS_TOKEN = 'egs_token'
	const stub = sinon
		.stub(estimateTransaction, 'estimateTransaction')
		.callsFake(() => async () => Promise.resolve(undefined))
	const result = (await sendContractMethod(dummyConstract as any)(
		'khaosCallback',
		['test', 0]
	)) as Transaction | undefined
	t.deepEqual(result, undefined)
	stub.restore()
})

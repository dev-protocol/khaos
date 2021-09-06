import test from 'ava'
import sinon from 'sinon'
import * as estimateTransaction from '../estimateTransaction/estimateTransaction'
import { sendContractMethod } from './sendContractMethod'

const tmp = async (): Promise<any> => {
	return {
		hash: '0xdummy',
	}
}

const dummyConstract = {
	khaosCallback: tmp,
}

test.serial('returns event information', async (t) => {
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

test.serial('returns undefined when estimatation is failed', async (t) => {
	const stub = sinon
		.stub(estimateTransaction, 'estimateTransaction')
		.callsFake(() => async () => Promise.resolve(undefined))
	const result = await sendContractMethod(dummyConstract as any)(
		'khaosCallback',
		['test', 0]
	)
	t.deepEqual(result, undefined)
	stub.restore()
})

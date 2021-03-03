import test from 'ava'
import { fake, stub } from 'sinon'
import * as compute from '../oracle/compute/compute'
import emulate from './index'

test.serial('Returns the results of the `compute` function', async (t) => {
	const computeFake = fake(
		() => Promise.resolve({ packed: 'just a test' }) as any
	)
	const factoryStub = stub(compute, 'compute').callsFake(() => computeFake)
	const res = await emulate({} as any, {
		params: { id: 'test_id' },
		body: { network: 'testnet', event: { myParam: 1 } },
	})
	t.deepEqual(factoryStub.getCall(0).args, ['test_id', 'testnet'])
	t.deepEqual(computeFake.getCall(0).args, [{ myParam: 1 }])
	t.deepEqual(res, { status: 200, body: { packed: 'just a test' } })

	factoryStub.restore()
})

test.serial(
	'Returns 400 when throw error from the `compute` function',
	async (t) => {
		// eslint-disable-next-line functional/no-promise-reject
		const computeFake = fake(() => Promise.reject('test'))
		const factoryStub = stub(compute, 'compute').callsFake(() => computeFake)
		const res = await emulate({} as any, {
			params: { id: 'test_id' },
			body: { network: 'testnet', event: { myParam: 1 } },
		})
		t.deepEqual(factoryStub.getCall(0).args, ['test_id', 'testnet'])
		t.deepEqual(computeFake.getCall(0).args, [{ myParam: 1 }])
		t.deepEqual(res, { status: 400, body: { packed: undefined } })

		factoryStub.restore()
	}
)

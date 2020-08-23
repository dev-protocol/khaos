import test from 'ava'
import { stub } from 'sinon'
import * as lastBlock from '../db/last-block'
import { getLastBlock } from './getLastBlock'

test.serial(
	'If the record exists, return the lastBlock that has been recorded.',
	async (t) => {
		const stubbedReader = stub(lastBlock, 'reader').callsFake(() => async () =>
			({
				statusCode: 200,
				resource: { lastBlock: 100 },
			} as any)
		)
		const result = await getLastBlock('dummy-khaos-id')
		t.is(result, 100)
		stubbedReader.restore()
	}
)

test.serial('If the record does not exist, return 0.', async (t) => {
	const stubbedReader = stub(lastBlock, 'reader').callsFake(() => async () =>
		({
			statusCode: 200,
			resource: undefined,
		} as any)
	)
	const result = await getLastBlock('dummy-khaos-id')
	t.is(result, 0)
	stubbedReader.restore()
})

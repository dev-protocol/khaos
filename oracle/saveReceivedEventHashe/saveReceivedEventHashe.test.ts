import test from 'ava'
import { stub } from 'sinon'
import * as received_event from '../db/received-event'
import { saveReceivedEventHashe } from './saveReceivedEventHashe'
import { MarketQueryData } from '../../common/structs'

test('Transaction hashe are stored in the DB.', async (t) => {
	const stubbedWriter = stub(received_event, 'writer').callsFake(
		() => async () =>
			({
				statusCode: 200,
				resource: {},
			} as any)
	)
	const data: MarketQueryData = {
		allData: { repo: 'hugahuga/hogihogi' } as any,
		publicSignature: 'hogehoge',
		transactionhash: 'dummy-transaction-hash',
	}
	const result = await saveReceivedEventHashe('example')(data)
	t.is(result.statusCode, 200)
	stubbedWriter.restore()
})

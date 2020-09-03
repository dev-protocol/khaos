import test from 'ava'
import { stub } from 'sinon'
import * as secret from '../../common/db/secret'
import { getSecret } from './getSecret'
import { MarketQueryData } from './../../common/structs'

test.serial(
	'If the record exists, it returns with the argument json object.',
	async (t) => {
		const stubbedReader = stub(secret, 'reader').callsFake(() => async () =>
			({
				statusCode: 200,
				resource: { secret: 'dummy-secret' },
			} as any)
		)
		const data: MarketQueryData = {
			allData: { repo: 'hugahuga/hogihogi' } as any,
			publicSignature: 'hogehoge',
			transactionhash: 'dummy-transaction-hash',
		}
		const result = await getSecret(data)
		t.is(result.secret.statusCode, 200)
		t.is(result.secret.resource?.secret, 'dummy-secret')
		stubbedReader.restore()
	}
)

test.serial(
	'If the record does not exist, it comes back with undefined.',
	async (t) => {
		const stubbedReader = stub(secret, 'reader').callsFake(() => async () =>
			({
				statusCode: 200,
				resource: undefined,
			} as any)
		)
		const data: MarketQueryData = {
			allData: { repo: 'hugahuga/hogihogi' } as any,
			publicSignature: 'hogehoge',
			transactionhash: 'dummy-transaction-hash',
		}
		const result = await getSecret(data)
		t.is(result.secret.statusCode, 200)
		t.is(result.secret.resource, undefined)
		stubbedReader.restore()
	}
)

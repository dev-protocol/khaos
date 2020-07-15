import test from 'ava'
import { stub } from 'sinon'
import * as secret from '../../common/db/secret'
import { getSecret } from './getSecret'

test.serial(
	'If the record exists, it returns with the argument json object.',
	async (t) => {
		const stubbedReader = stub(secret, 'reader').callsFake(() => async () =>
			({
				statusCode: 200,
				resource: { secret: 'dummy-secret' },
			} as any)
		)
		const result = await getSecret({ s: 'dummy' } as any)
		t.is(result.secret.statusCode, 200)
		t.is(result.secret.resource?.secret, 'dummy-secret')
		t.is(result.json.s, 'dummy')
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
		const result = await getSecret({ s: 'dummy2' } as any)
		t.is(result.secret.statusCode, 200)
		t.is(result.secret.resource, undefined)
		t.is(result.json.s, 'dummy2')
		stubbedReader.restore()
	}
)

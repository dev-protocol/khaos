import test from 'ava'
import oraclize from './oraclize'
import { KhaosEventData } from './../../oracle/getData/getData'

test('oraclize is executed.', async (t) => {
	const map = new Map<string, string>()
	map.set('key1', 'value1')
	const data: KhaosEventData = {
		key: 'dummy-key',
		publicSignature: 'dummy-signature',
		additionalData: 'dummy-data',
	}
	const res = await oraclize(
		{ address: 'account', id: 'signature', message: 'data' },
		data
	)
	t.is(res, '')
})

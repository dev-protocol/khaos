import test from 'ava'
import oraclize from './oraclize'

test('oraclize is executed.', async (t) => {
	const res = await oraclize(
		{ address: 'account', id: 'signature', message: 'data' },
		{ allData: '{}', publicSignature: 'dummy-public-signature' }
	)
	t.is(res.message, '')
	t.is(res.status, 0)
	t.is(res.statusMessage, '')
})

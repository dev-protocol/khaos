import test from 'ava'
import oraclize from './oraclize'

test('oraclize is executed.', async (t) => {
	const res = await oraclize(
		{ address: 'account', id: 'signature', message: 'data' },
		{ allData: '{}', publicSignature: 'dummy-public-signature' } as any,
		'mainnet'
	)
	t.is(res.message, 'data')
	t.is(res.status, 0)
	t.is(res.statusMessage, 'mainnet dummy-public-signature')
})

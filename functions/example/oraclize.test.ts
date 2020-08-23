import test from 'ava'
import oraclize from './oraclize'

test('oraclize is executed.', async (t) => {
	const res = await oraclize('', '', 'dummy-signature')
	t.is(res, '')
})

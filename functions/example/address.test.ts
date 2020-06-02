import test from 'ava'
import address from './address'

test('The address comes back.', async (t) => {
	const res = address()
	t.is(res, '0x00......')
})

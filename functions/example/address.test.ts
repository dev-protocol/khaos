import test from 'ava'
import address from './address'

test('Returns the address on mainnet', async (t) => {
	const res = address('mainnet')
	t.is(res, '0x10......')
})

test('Returns the address on ropsten', async (t) => {
	const res = address('ropsten')
	t.is(res, '0x20......')
})

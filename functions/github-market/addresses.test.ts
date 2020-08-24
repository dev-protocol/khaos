import test from 'ava'
import addresses from './addresses'

test('Returns mainnet address', async (t) => {
	const res = await addresses('mainnet')
	t.is(res, '0x1')
})

test('Returns ropsten address', async (t) => {
	const res = await addresses('ropsten')
	t.is(res, '0x2')
})

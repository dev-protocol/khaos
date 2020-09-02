import test from 'ava'
import addresses from './addresses'

test('Returns mainnet address', async (t) => {
	const res = await addresses('mainnet')
	t.is(res, '0x3cB902625a2B38929f807f9c841F7aecBbCe7702')
})

test('Returns ropsten address', async (t) => {
	const res = await addresses('ropsten')
	t.is(res, '0xE071bb5861e2352C89992799896D124F1bA5d599')
})

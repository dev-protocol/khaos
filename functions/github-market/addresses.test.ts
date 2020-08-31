import test from 'ava'
import addresses from './addresses'

test('Returns mainnet address', async (t) => {
	const res = await addresses('mainnet')
	t.is(res, '0x6F221880EfBDA39fCA030E2a2749bB4F339b1C15')
})

test('Returns ropsten address', async (t) => {
	const res = await addresses('ropsten')
	t.is(res, '0xE071bb5861e2352C89992799896D124F1bA5d599')
})

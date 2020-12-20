import test from 'ava'
import addresses from './addresses'

test('Returns mainnet address', async (t) => {
	const res = await addresses({ network: 'mainnet' })
	t.is(res, '0x1510EA12a30E5c40b406660871b335feA32f29A')
})

test('Returns ropsten address', async (t) => {
	const res = await addresses({ network: 'ropsten' })
	t.is(res, '0x609Fe85Dbb9487d55B5eF50451e20ba2Edc8F4B7')
})

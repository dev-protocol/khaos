/* eslint-disable functional/no-let */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
/* eslint-disable functional/immutable-data */
import test from 'ava'
import { sendContractMethod } from './sendContractMethod'

test('event information is coming back.', async (t) => {
	process.env.MNEMONIC =
		'size wish volume lecture dinner drastic easy assume pledge ribbon bunker stand drill grunt dutch'
	const result = await sendContractMethod({} as any)({
		result: 'dummy-result',
	} as any)
	t.is(result, true)
})

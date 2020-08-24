/* eslint-disable functional/no-let */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
/* eslint-disable functional/immutable-data */
import test from 'ava'
import { sendContractMethod } from './sendContractMethod'

const tmp = async (): Promise<any> => {
	return {}
}

const dummyConstract = {
	khaosCallback: tmp,
}

test('event information is coming back.', async (t) => {
	const result = await sendContractMethod(dummyConstract as any)({
		result: 'dummy-result',
	} as any)
	t.is(result, true)
})

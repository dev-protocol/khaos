import test from 'ava'
import { sendContractMethod } from './sendContractMethod'

const tmp = async (): Promise<any> => {
	return {
		hash: '0xdummy',
	}
}

const dummyConstract = {
	khaosCallback: tmp,
}

test('event information is coming back.', async (t) => {
	const result = await sendContractMethod(
		dummyConstract as any
	)('khaosCallback', ['test', 0])
	t.deepEqual(result, {
		hash: '0xdummy',
	} as any)
})

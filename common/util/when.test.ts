import test from 'ava'
import { when } from './when'

async function testFunc(arg: any): Promise<string> {
	return new Promise(function (resolve) {
		const tmp = arg + 1
		resolve(tmp.toString())
	})
}

test('The function is executed successfully when the value is present..', async (t) => {
	const arg = {
		value: 5,
	}
	const result = await when(arg, ({ value }) => testFunc(value))
	t.is(result, '6')
})

test('The function does not execute correctly when the value does not exist.', async (t) => {
	const arg = { value: undefined }
	const result = await when(arg, ({ value }) => testFunc(value))
	t.is(result, 'NaN')
})

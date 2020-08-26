import test from 'ava'
import example from '../../functions/example/abi'
import { importAbi } from './importAbi'

test('Returns a function that exists in functions/abi', async (t) => {
	const result = await importAbi('example')
	const expected = example
	t.is(result?.toString(), expected.toString())
})

test('Returns a function that always returns undefined when not exists in functions/abi', async (t) => {
	const result = await importAbi('*30%Cj*')
	t.is(result, undefined)
})

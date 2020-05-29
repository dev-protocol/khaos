import test from 'ava'
import example from '../../functions/example/address'
import { importAddress } from './importAddress'
import { always, F } from 'ramda'

test('Returns a function that exists in functions/address', async (t) => {
	const result = await importAddress('example')
	const expected = example
	t.is(result.toString(), expected.toString())
})

test('Returns a function that always returns false when not exists in functions/address', async (t) => {
	const result = await importAddress('*30%Cj*')
	const expected = always(F)()
	t.is(result.toString(), expected.toString())
})

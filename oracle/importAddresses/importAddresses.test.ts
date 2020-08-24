import test from 'ava'
import example from '../../functions/example/addresses'
import { importAddresses } from './importAddresses'
import { always } from 'ramda'

test('Returns a function that exists in functions/addresses', async (t) => {
	const result = await importAddresses('example')
	const expected = example
	t.is(result.toString(), expected.toString())
})

test('Returns a function that always returns false when not exists in functions/addresses', async (t) => {
	const result = await importAddresses('*30%Cj*')
	const expected = always(undefined)
	console.log()
	t.is(result.toString(), expected.toString())
})

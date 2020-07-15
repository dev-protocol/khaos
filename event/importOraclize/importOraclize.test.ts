import test from 'ava'
import example from '../../functions/example/oraclize'
import { importOraclize } from './importOraclize'
import { always } from 'ramda'

test('Returns a function that exists in functions/oraclize', async (t) => {
	const result = await importOraclize('example')
	const expected = example
	t.is(result.toString(), expected.toString())
})

test('Returns a function that always returns false when not exists in functions/oraclize', async (t) => {
	const result = await importOraclize('*30%Cj*')
	const expected = always(undefined)
	console.log()
	t.is(result.toString(), expected.toString())
})

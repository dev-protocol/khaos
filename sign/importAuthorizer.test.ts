import test from 'ava'
import example from '../functions/authorizer/example'
import { importAuthorizer } from './importAuthorizer'
import { always, F } from 'ramda'

test('Returns a function that exists in functions/authorizer', async (t) => {
	const result = await importAuthorizer('example')
	const expected = example
	t.is(result.toString(), expected.toString())
})

test('Returns a function that always returns false when not exists in functions/authorizer', async (t) => {
	const result = await importAuthorizer('*30%Cj*')
	const expected = always(F)()
	t.is(result.toString(), expected.toString())
})

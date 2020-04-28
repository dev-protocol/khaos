import test from 'ava'
import sign from './index'
import { HttpRequest, Context } from '@azure/functions'

const createContext = (): Context =>
	(({
		res: {},
	} as unknown) as Context)
const createReq = (id?: string): HttpRequest =>
	(({
		params: {
			id,
		},
	} as unknown) as HttpRequest)

test('This test is a prototype', async (t) => {
	const context = createContext()
	await sign(context, createReq())
	t.is(context.res?.status, 400)
	t.is(typeof context.res?.body, 'string')
})

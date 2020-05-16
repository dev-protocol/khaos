import test from 'ava'
import authorizer from './authorizer'

test('Returns true if the passed message and secret are string type', async (t) => {
	const res = await authorizer({
		message: 'test',
		secret: 'test',
		req: {} as any,
	})
	t.true(res)
})

test('Returns false if either the passed message or secret is not string type', async (t) => {
	const [res1, res2, res3] = await Promise.all([
		authorizer({ message: 1 as any, secret: 'test', req: {} as any }),
		authorizer({ message: 'test', secret: 1 as any, req: {} as any }),
		authorizer({ message: 1 as any, secret: 1 as any, req: {} as any }),
	])
	t.false(res1)
	t.false(res2)
	t.false(res3)
})

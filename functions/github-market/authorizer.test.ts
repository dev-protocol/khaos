import test from 'ava'
import authorizer from './authorizer'

test('Successful authentication.', async (t) => {
	const res = await authorizer({
		message: 'Akira-Taniguchi/cloud_lib',
		secret: 'f9092e92428595c3e852e2502a0f5e7b3e7c0e35',
	} as any)
	t.true(res)
})

test('If the user does not exist, the authentication fails.', async (t) => {
	const res = await authorizer({
		message: 'user/cloud_lib',
		secret: 'f9092e92428595c3e852e2502a0f5e7b3e7c0e35',
	} as any)
	t.false(res)
})

test('If the repository does not exist, the authentication fails', async (t) => {
	const res = await authorizer({
		message: 'Akira-Taniguchi/huubaa',
		secret: 'f9092e92428595c3e852e2502a0f5e7b3e7c0e35',
	} as any)
	t.false(res)
})

test('If the pat does not exist, the authentication fails', async (t) => {
	const res = await authorizer({
		message: 'Akira-Taniguchi/cloud_lib',
		secret: '00000e92428595c3e852e2502a0f5e7b3e7c0CE5',
	} as any)
	t.false(res)
})

test('Successful authentication.(organization repository)', async (t) => {
	const res = await authorizer({
		message: 'dev-protocol/khaos',
		secret: 'f9092e92428595c3e852e2502a0f5e7b3e7c0e35',
	} as any)
	t.true(res)
})

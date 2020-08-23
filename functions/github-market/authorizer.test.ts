import test from 'ava'
import authorizer from './authorizer'



test('Successful authentication', async (t) => {
	const res = await authorizer(
		{message: 'Akira-Taniguchi/cloud_lib', secret: 'f9092e92428595c3e852e2502a0f5e7b3e7c0e35'} as any
	)
	t.true(res)
})

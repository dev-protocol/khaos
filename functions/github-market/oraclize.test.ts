import test from 'ava'
import oraclize from './oraclize'

test('Successful authentication', async (t) => {
	const res = await oraclize(
		{ message: 'xxx/yyy', address: '0x1234', id: 'dummy-public-signature' },
		{ allData: { rep: 'xxx/yyy' }, publicSignature: 'dummy-public-signature' }
	)
	t.is(res.message, 'xxx/yyy')
	t.is(res.status, 0)
	t.is(res.statusMessage, 'success')
})

test('Returns error when the passed repository is not authorized', async (t) => {
	const res = await oraclize(
		{ message: 'xxx/yyy', address: '0x1234', id: 'dummy-public-signature' },
		{ allData: { rep: 'yyy/zzz' }, publicSignature: 'dummy-public-signature' }
	)
	t.is(res.message, 'xxx/yyy')
	t.is(res.status, 2)
	t.is(res.statusMessage, 'error')
})

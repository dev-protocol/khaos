import test from 'ava'
import oraclize from './oraclize'
import { PublicSignatureOptions } from './../../sign/publicSignature/publicSignature'
import { MarketQueryData } from './../../oracle/getData/getData'

test('If message and githubRepository are the same, it is treated as success.', async (t) => {
	const arg1: PublicSignatureOptions = {
		message: 'user/repository',
		id: 'github-market',
		address: '0x1234',
	}
	const arg2: MarketQueryData = {
		publicSignature: 'dummy-publicSignature',
		allData: { githubRepository: 'user/repository' },
	}
	const res = await oraclize(arg1, arg2)
	t.is(res.message, 'user/repository')
	t.is(res.status, 0)
	t.is(res.statusMessage, 'success')
})

test('If message and githubRepository are not the same, it is treated as fail.', async (t) => {
	const arg1: PublicSignatureOptions = {
		message: 'user/repository',
		id: 'github-market',
		address: '0x1234',
	}
	const arg2: MarketQueryData = {
		publicSignature: 'dummy-publicSignature',
		allData: { githubRepository: 'hoge/hura' },
	}
	const res = await oraclize(arg1, arg2)
	t.is(res.message, 'user/repository')
	t.is(res.status, 2)
	t.is(res.statusMessage, 'error')
})

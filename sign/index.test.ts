import test from 'ava'
import sign from './index'
import { HttpRequest, Context } from '@azure/functions'
import Web3 from 'web3'
import { Sign } from 'web3-core/types'

const createContext = (): Context =>
	(({
		res: {},
	} as unknown) as Context)
const createReq = (
	id?: string,
	message?: string,
	signature?: string
): HttpRequest =>
	(({
		params: {
			id,
		},
		body: {
			message,
			signature,
		},
	} as unknown) as HttpRequest)
const createSignature = (): Sign => {
	const web3 = new Web3()
	const message =
		'!*&H8sw$xz1FsYzcpy6TS^8geyT^M!hTjW%b!!gZZd$H%&XVS/9LStj$aH1mVJZHLp0njOui*7zXog$kNgH!nn2iUekAWXeVfDHh'
	const account = web3.eth.accounts.create()
	return web3.eth.accounts.sign(message, account.privateKey)
}
test('This test is a prototype', async (t) => {
	const context = createContext()
	const signature = createSignature()
	await sign(
		context,
		createReq('example', signature.message, signature.signature)
	)
	t.is(context.res?.status, 200)
	t.is(typeof context.res?.body, 'string')
})

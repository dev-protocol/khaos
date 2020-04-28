import test from 'ava'
import Web3 from 'web3'
import { Sign } from 'web3-core/types'
import { join } from 'path'
import { readdirSync } from 'fs'
import { HttpRequest, Context } from '@azure/functions'
import sign from './index'
import { recover } from './recover'

const TEST_MESSAGE = 'TEST_MESSAGE'
const TEST_SECRET = 'TEST_SECRET'

const createContext = (): Context =>
	(({
		res: {},
	} as unknown) as Context)
const createReq = (
	id?: string,
	message?: string,
	secret?: string,
	signature?: string
): HttpRequest =>
	(({
		params: {
			id,
		},
		body: {
			message,
			secret,
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

test.todo('Returns the account that sign')

test.todo('Returns a new public signature')

test('All sign methods succeed', (t) =>
	Promise.all(
		readdirSync(join(__dirname, '../functions/sign'), {
			withFileTypes: true,
		})
			.filter((dirent) => dirent.isDirectory())
			.map((dirent) => dirent.name)
			.map((id) =>
				(async () => {
					t.log(`signing method: ${id}`)
					const context = createContext()
					const { signature } = createSignature()
					const account = recover(TEST_MESSAGE, signature)
					await sign(
						context,
						createReq(id, TEST_MESSAGE, TEST_SECRET, signature)
					)
					return {
						id,
						context,
						account,
						message: TEST_MESSAGE,
						secret: TEST_SECRET,
					}
				})()
			)
	).then((results) => {
		results.map((result) => {
			t.log(result)
			t.log(result.context)
			t.is(result.context.res?.status, 200)
			t.is(result.context.res?.body.account, result.account)
			t.true(typeof result.context.res?.body.publicSignature === 'string')
		})
	}))

import test from 'ava'
import { join } from 'path'
import { readdirSync } from 'fs'
import { HttpRequest, Context } from '@azure/functions'
import { stub } from 'sinon'
import * as recover from './recover'
import * as db from './db'
import { sign as fakeSignature } from 'jsonwebtoken'
import sign from './index'
import { publicSignature } from './publicSignature'

const TEST_MESSAGE = 'TEST_MESSAGE'
const TEST_SECRET = 'TEST_SECRET'

// eslint-disable-next-line functional/prefer-readonly-type
const fakeStore: Map<string, string> = new Map()
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
const fakeRecover = (message: string, signature: string): string =>
	`${message}-${signature}`
stub(recover, 'recover').callsFake(fakeRecover)
stub(db, 'writer').callsFake(() => async (data: db.Secret) =>
	fakeStore.set(data.id, data.secret) as any
)

test.todo('Returns the signed account')

test.todo('Returns a new public signature')

test.todo('Returns account as `undefined` when fail to recover address')

test.todo(
	'Returns a new public signature as `undefined` when fail to recover address'
)

test.todo('The response code is 200 when calling with an existing method')

test.todo('The response code is 400 when calling does not exist method')

test('Save passed secret to CosmosDB with a new public signature as the key', async (t) => {
	const id = 'xxx'
	const context = createContext()
	const signature = fakeSignature(Math.random().toString(), id)
	const secret = `${Math.random().toString()}${TEST_SECRET}`
	const message = `${Math.random().toString()}${TEST_MESSAGE}`
	await sign(context, createReq(id, message, secret, signature))
	const fakeAccount = fakeRecover(message, signature)
	const expectedPubSig = publicSignature(message, fakeAccount, id)
	const data = fakeStore.get(expectedPubSig)
	t.is(data, secret)
})

test('All sign methods succeed', (t) =>
	Promise.all(
		readdirSync(join(__dirname, '../functions/authorizer'), {
			withFileTypes: true,
		})
			.filter((dirent) => dirent.isDirectory())
			.map((dirent) => dirent.name)
			.map((id) =>
				(async () => {
					t.log(`signing method: ${id}`)
					const context = createContext()
					const signature = fakeSignature(Math.random().toString(), id)
					await sign(
						context,
						createReq(id, TEST_MESSAGE, TEST_SECRET, signature)
					)
					return {
						id,
						context,
						signature,
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
			t.is(
				result.context.res?.body.account,
				fakeRecover(result.message, result.signature)
			)
			t.is(
				result.context.res?.body.publicSignature,
				publicSignature(
					result.message,
					result.context.res?.body.account,
					result.id
				)
			)
		})
	}))

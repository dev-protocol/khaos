import test from 'ava'
import { HttpRequest, Context } from '@azure/functions'
import { stub } from 'sinon'
import * as recover from './recover/recover'
import * as db from './../common/db/secret'
import * as importAuthorizer from './importAuthorizer/importAuthorizer'
import { sign as fakeSignature } from 'jsonwebtoken'
import sign from './index'
import { publicSignature } from './publicSignature/publicSignature'

// eslint-disable-next-line functional/prefer-readonly-type
const fakeStore: Map<string, { [key: string]: string }> = new Map()
const random = (): string => Math.random().toString()
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
stub(db, 'writer').callsFake(() => async (data: db.Secret) => {
	fakeStore.set(data.id, data) as any
	return {
		statusCode: 200,
	} as any
})

test.serial('Returns the signed account', async (t) => {
	const id = 'xxx'
	const stubbed = stub(
		importAuthorizer,
		'importAuthorizer'
	).callsFake(async () => () => true)
	const context = createContext()
	const signature = fakeSignature(random(), id)
	const secret = random()
	const message = random()
	const res = await sign(context, createReq(id, message, secret, signature))
	const fakeAccount = fakeRecover(message, signature)
	stubbed.restore()
	t.is(res?.body?.address, fakeAccount)
})

test.todo('Returns a new public signature')

test.todo('Returns account as `undefined` when fail to recover address')

test.todo(
	'Returns a new public signature as `undefined` when fail to recover address'
)

test.todo('The response code is 200 when calling with an existing method')

test.todo('The response code is 400 when calling does not exist method')

test.serial(
	'Save passed secret to CosmosDB with a new public signature as the key',
	async (t) => {
		const id = 'xxx'
		const stubbed = stub(
			importAuthorizer,
			'importAuthorizer'
		).callsFake(async () => () => true)
		const signature = fakeSignature(random(), id)
		const secret = random()
		const message = random()
		await sign(createContext(), createReq(id, message, secret, signature))
		const fakeAccount = fakeRecover(message, signature)
		const expectedPubSig = publicSignature({
			message,
			id,
			address: fakeAccount,
		})
		const data = fakeStore.get(expectedPubSig)
		stubbed.restore()
		t.deepEqual(data, { id: expectedPubSig, secret, address: fakeAccount })
	}
)

test.serial(
	`When failed authentication doesn't save the secret to CosmosDB`,
	async (t) => {
		const id = 'xxx'
		const stubbed = stub(
			importAuthorizer,
			'importAuthorizer'
		).callsFake(async () => () => false)
		const signature = fakeSignature(random(), id)
		const secret = random()
		const message = random()
		await sign(createContext(), createReq(id, message, secret, signature))
		const fakeAccount = fakeRecover(message, signature)
		const expectedPubSig = publicSignature({
			message,
			id,
			address: fakeAccount,
		})
		const data = fakeStore.get(expectedPubSig)
		stubbed.restore()
		t.is(data, undefined)
	}
)

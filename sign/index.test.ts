import test from 'ava'
import { HttpRequest, Context } from '@azure/functions'
import { stub } from 'sinon'
import * as recover from './recover/recover'
import * as db from './../common/db/secret'
import * as khaosFunctions from '@devprotocol/khaos-functions'
import { sign as fakeSignature } from 'jsonwebtoken'
import sign from './index'
import { publicSignature } from '@devprotocol/khaos-core/sign/publicSignature/publicSignature'

// eslint-disable-next-line functional/prefer-readonly-type
const fakeStore: Map<string, { [key: string]: string }> = new Map()
const random = (): string => Math.random().toString()
const fakeImportAuthorizer = () => async () => ({ data: true })
const fakeRecover = (message: string, signature: string): string | undefined =>
	`${message}-${signature}`
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
const returnFakeWriter = new Map([
	[
		'default',
		{
			statusCode: 200,
		},
	],
])
stub(db, 'writer').callsFake(() => async (data: db.Secret) => {
	fakeStore.set(data.id, data) as any
	return returnFakeWriter.get('default') as any
})

test.serial('Returns the signed account', async (t) => {
	const stubs = [
		stub(recover, 'recover').callsFake(fakeRecover),
		stub(khaosFunctions, 'call').callsFake(fakeImportAuthorizer),
	]
	returnFakeWriter.set('default', { statusCode: 200 })
	const id = 'xxx'
	const context = createContext()
	const signature = fakeSignature(random(), id)
	const secret = random()
	const message = random()
	const address = fakeRecover(message, signature)
	const res = await sign(context, createReq(id, message, secret, signature))
	stubs.map((s) => s.restore())
	t.is(res?.body?.address, address)
})

test.serial('Returns a new public signature', async (t) => {
	const stubs = [
		stub(recover, 'recover').callsFake(fakeRecover),
		stub(khaosFunctions, 'call').callsFake(fakeImportAuthorizer),
	]
	returnFakeWriter.set('default', { statusCode: 200 })
	const id = 'xxx'
	const context = createContext()
	const signature = fakeSignature(random(), id)
	const secret = random()
	const message = random()
	const address: any = fakeRecover(message, signature)
	const sig = publicSignature({ id, message, address })
	const res = await sign(context, createReq(id, message, secret, signature))
	stubs.map((s) => s.restore())
	t.is(res?.body?.publicSignature, sig)
})

test.serial(
	'Returns account as `undefined` when fail to recover address',
	async (t) => {
		const stubs = [
			stub(recover, 'recover').callsFake(() => undefined),
			stub(khaosFunctions, 'call').callsFake(fakeImportAuthorizer),
		]
		returnFakeWriter.set('default', { statusCode: 200 })
		const id = 'xxx'
		const context = createContext()
		const signature = fakeSignature(random(), id)
		const secret = random()
		const message = random()
		const res = await sign(context, createReq(id, message, secret, signature))
		stubs.map((s) => s.restore())
		t.is(res?.body?.address, undefined)
	}
)

test.serial(
	'Returns a new public signature as `undefined` when fail to recover address',
	async (t) => {
		const stubs = [
			stub(recover, 'recover').callsFake(() => undefined),
			stub(khaosFunctions, 'call').callsFake(fakeImportAuthorizer),
		]
		returnFakeWriter.set('default', { statusCode: 200 })
		const id = 'xxx'
		const context = createContext()
		const signature = fakeSignature(random(), id)
		const secret = random()
		const message = random()
		const res = await sign(
			context,
			createReq(id, message, secret, `0${signature}`)
		)
		stubs.map((s) => s.restore())
		t.is(res?.body?.publicSignature, undefined)
	}
)

test.serial(
	'The response code is 200 when the authorizer method returns true and stored the secrets',
	async (t) => {
		const stubs = [
			stub(recover, 'recover').callsFake(fakeRecover),
			stub(khaosFunctions, 'call').callsFake(fakeImportAuthorizer),
		]
		returnFakeWriter.set('default', { statusCode: 200 })
		const id = 'xxx'
		const context = createContext()
		const signature = fakeSignature(random(), id)
		const secret = random()
		const message = random()
		const res = await sign(context, createReq(id, message, secret, signature))
		stubs.map((s) => s.restore())
		t.is(res.status, 200)
	}
)

test.serial(
	'The response code is 400 when the authorizer method returns false',
	async (t) => {
		const stubs = [
			stub(recover, 'recover').callsFake(fakeRecover),
			stub(khaosFunctions, 'call').callsFake(() => async () => ({
				data: false,
			})),
		]
		returnFakeWriter.set('default', { statusCode: 200 })
		const id = 'xxx'
		const context = createContext()
		const signature = fakeSignature(random(), id)
		const secret = random()
		const message = random()
		const res = await sign(context, createReq(id, message, secret, signature))
		stubs.map((s) => s.restore())
		t.is(res.status, 400)
	}
)

test.serial(
	'The response code is 500 when the authorizer method returns true but failed storing',
	async (t) => {
		const stubs = [
			stub(recover, 'recover').callsFake(fakeRecover),
			stub(khaosFunctions, 'call').callsFake(fakeImportAuthorizer),
		]
		returnFakeWriter.set('default', { statusCode: 500 })
		const id = 'xxx'
		const context = createContext()
		const signature = fakeSignature(random(), id)
		const secret = random()
		const message = random()
		const res = await sign(context, createReq(id, message, secret, signature))
		stubs.map((s) => s.restore())
		t.is(res.status, 500)
	}
)

test.serial(
	'Save passed secret to CosmosDB with a new public signature as the key',
	async (t) => {
		const stubs = [
			stub(recover, 'recover').callsFake(fakeRecover),
			stub(khaosFunctions, 'call').callsFake(fakeImportAuthorizer),
		]
		returnFakeWriter.set('default', { statusCode: 200 })
		const id = 'xxx'
		const signature = fakeSignature(random(), id)
		const secret = random()
		const message = random()
		await sign(createContext(), createReq(id, message, secret, signature))
		const fakeAccount: any = fakeRecover(message, signature)
		const expectedPubSig = publicSignature({
			message,
			id,
			address: fakeAccount,
		})
		const data = fakeStore.get(expectedPubSig)
		stubs.map((s) => s.restore())
		t.deepEqual(data, { id: expectedPubSig, secret, address: fakeAccount })
	}
)

test.serial(
	`When failed authentication doesn't save the secret to CosmosDB`,
	async (t) => {
		const stubs = [
			stub(recover, 'recover').callsFake(fakeRecover),
			stub(khaosFunctions, 'call').callsFake(() => async () => ({
				data: false,
			})),
		]
		const id = 'xxx'
		const signature = fakeSignature(random(), id)
		const secret = random()
		const message = random()
		await sign(createContext(), createReq(id, message, secret, signature))
		const fakeAccount: any = fakeRecover(message, signature)
		const expectedPubSig = publicSignature({
			message,
			id,
			address: fakeAccount,
		})
		const data = fakeStore.get(expectedPubSig)
		stubs.map((s) => s.restore())
		t.is(data, undefined)
	}
)

/* eslint-disable functional/no-throw-statement */
import test from 'ava'
import * as db from './../common/db/secret'
import * as jwt from 'jsonwebtoken'
import { stub } from 'sinon'
import { verify } from '.'

test.serial(
	'Returns true when the passed id is already saved on DB and verify succeeded',
	async (t) => {
		const account = 'S1zxiLd8jb4u@KKz7IDNlfz4&OPR@&j&EZkX'
		const message = '6q7#kbquJA%PradxeMA9wtkNY$M5F%nd1P55'
		const pubSigAsId = jwt.sign(message, account)
		const stubbedReader = stub(db, 'reader').callsFake(() => async () =>
			({
				statusCode: 200,
				resource: { secret: '' },
			} as any)
		)
		const result = await verify(pubSigAsId, account)
		t.is(result, true)
		stubbedReader.restore()
	}
)

test.serial(
	'Returns false when the passed id is already saved on DB but verify failed',
	async (t) => {
		const account = 'S1zxiLd8jb4u@KKz7IDNlfz4&OPR@&j&EZkX'
		const message = '6q7#kbquJA%PradxeMA9wtkNY$M5F%nd1P55'
		const pubSigAsId = jwt.sign(message, account)
		const stubbedReader = stub(db, 'reader').callsFake(() => async () =>
			({
				statusCode: 200,
				resource: { secret: '' },
			} as any)
		)
		const result = await verify(`0${pubSigAsId}`, account)
		t.is(result, false)
		stubbedReader.restore()
	}
)

test.serial(
	'Returns false when the passed id is not founded on DB',
	async (t) => {
		const account = 'S1zxiLd8jb4u@KKz7IDNlfz4&OPR@&j&EZkX'
		const message = '6q7#kbquJA%PradxeMA9wtkNY$M5F%nd1P55'
		const pubSigAsId = jwt.sign(message, account)
		const stubbedReader = stub(db, 'reader').callsFake(() => async () =>
			({
				statusCode: 404,
			} as any)
		)
		const result = await verify(pubSigAsId, account)
		t.is(result, false)
		stubbedReader.restore()
	}
)

test.serial('Returns false when thrown by DB', async (t) => {
	const account = 'S1zxiLd8jb4u@KKz7IDNlfz4&OPR@&j&EZkX'
	const message = '6q7#kbquJA%PradxeMA9wtkNY$M5F%nd1P55'
	const pubSigAsId = jwt.sign(message, account)
	const stubbedReader = stub(db, 'reader').callsFake(() => async () => {
		throw new Error()
	})
	const result = await verify(pubSigAsId, account)
	t.is(result, false)
	stubbedReader.restore()
})

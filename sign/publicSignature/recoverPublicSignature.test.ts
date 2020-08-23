import test from 'ava'
import { sign } from 'jsonwebtoken'
import { publicSignature as pubSig } from './publicSignature'
import { recoverPublicSignature } from './recoverPublicSignature'

const random = (): string =>
	sign(Math.random().toString(), Math.random().toString())

test('Returns recovered object from the passed publicSignature and address', (t) => {
	const message = random()
	const id = random()
	const address = random()
	const publicSignature = pubSig({ message, id, address })
	const result = recoverPublicSignature(publicSignature, address)
	t.deepEqual(result, { message, id, address })
})

test('Returns undefined when the passed publicSignature is invalid', (t) => {
	const message = random()
	const id = random()
	const address = random()
	const publicSignature = pubSig({ message, id, address })
	const result = recoverPublicSignature(`0${publicSignature}`, address)
	t.is(result, undefined)
})

test('Returns undefined when the passed address is invalid', (t) => {
	const message = random()
	const id = random()
	const address = random()
	const publicSignature = pubSig({ message, id, address })
	const result = recoverPublicSignature(publicSignature, `0${address}`)
	t.is(result, undefined)
})

test('Returns undefined when the passed publicSignature and the passed address are invalid', (t) => {
	const message = random()
	const id = random()
	const address = random()
	const publicSignature = pubSig({ message, id, address })
	const result = recoverPublicSignature(`0${publicSignature}`, `0${address}`)
	t.is(result, undefined)
})

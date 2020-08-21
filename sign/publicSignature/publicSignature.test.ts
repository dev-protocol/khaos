import test from 'ava'
import { sign, verify } from 'jsonwebtoken'
import { publicSignature } from './publicSignature'
import { tryCatch, always } from 'ramda'

const random = (): string =>
	sign(Math.random().toString(), Math.random().toString())

test('Returns signature from the passed message, address and sign method name', (t) => {
	const message = 'A'
	const id = 'C'
	const address = 'B'
	const expected = sign(`%${message}%-%${id}%`, address)
	const result = publicSignature({ message, id, address })
	t.is(result, expected)
})

test('Returns the same result when the same arguments', (t) => {
	const message = random()
	const id = random()
	const address = random()
	const expected = sign(`%${message}%-%${id}%`, address)
	const result1 = publicSignature({ message, id, address })
	const result2 = publicSignature({ message, id, address })
	const result3 = publicSignature({ message, id, address })
	t.is(result1, expected)
	t.is(result2, expected)
	t.is(result3, expected)
})

test('Returns the different result when the different arguments', (t) => {
	const message = random()
	const id = random()
	const address = random()
	const sig = sign(`%${message}%-%${id}%`, address)
	const result1 = publicSignature({ message: `0${message}`, id, address })
	const result2 = publicSignature({ message, id: `0${id}`, address })
	const result3 = publicSignature({ message, id, address: `0${address}` })
	t.not(result1, sig)
	t.not(result2, sig)
	t.not(result3, sig)
})

test('A created signature can be verified by the account address', (t) => {
	const message = random()
	const id = random()
	const address = random()
	const pubSig = publicSignature({ message, id, address })
	const verified = verify(pubSig, address)
	const expected = `%${message}%-%${id}%`
	t.is(verified, expected)
})

test('Should fail to verify when an account address is mismatch', (t) => {
	const message = random()
	const id = random()
	const address = random()
	const pubSig = publicSignature({ message, id, address })
	const check = tryCatch(
		(sig: string, account: string) => verify(sig, account),
		always(undefined)
	)
	const verified1 = check(pubSig, `0${address}`)
	const verified2 = check(pubSig, address.toLowerCase())
	const verified3 = check(pubSig, address.toUpperCase())
	t.is(verified1, undefined)
	t.is(verified2, undefined)
	t.is(verified3, undefined)
})

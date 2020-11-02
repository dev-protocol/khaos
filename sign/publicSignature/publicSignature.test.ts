/* eslint-disable @typescript-eslint/explicit-function-return-type */
import test from 'ava'
import { sign, verify } from 'jsonwebtoken'
import { publicSignature } from './publicSignature'
import { tryCatch, always } from 'ramda'
import { JWTVerifyWithoutCallback } from '../../common/types'

const random = (): string =>
	sign(Math.random().toString(), Math.random().toString())

test('Returns signature from the passed message, address and sign method name', (t) => {
	const message = 'A'
	const id = 'C'
	const address = 'B'
	const expected = sign(JSON.stringify({ i: id, m: message }), address)
	const result = publicSignature({ message, id, address })
	t.is(result, expected)
})

test('Returns the same result when the same arguments', (t) => {
	const message = random()
	const id = random()
	const address = random()
	const expected = sign(JSON.stringify({ i: id, m: message }), address)
	const result1 = publicSignature({ message, id, address })
	const result2 = publicSignature({ message, id, address })
	const result3 = publicSignature({ message, id, address })
	t.is(result1, expected)
	t.is(result2, expected)
	t.is(result3, expected)
})

test('Returns the same result when the same arguments with different order', (t) => {
	const message = random()
	const id = random()
	const address = random()
	const expected = sign(JSON.stringify({ i: id, m: message }), address)
	const result1 = publicSignature({ address, id, message })
	const result2 = publicSignature({ address, message, id })
	const result3 = publicSignature({ id, address, message })
	const result4 = publicSignature({ id, message, address })
	const result5 = publicSignature({ message, id, address })
	const result6 = publicSignature({ message, address, id })
	t.is(result1, expected)
	t.is(result2, expected)
	t.is(result3, expected)
	t.is(result4, expected)
	t.is(result5, expected)
	t.is(result6, expected)
})

test('Returns the different result when the different arguments', (t) => {
	const message = random()
	const id = random()
	const address = random()
	const sig = sign(JSON.stringify({ i: id, m: message }), address)
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
	const expected = { m: message, i: id }
	t.like(verified, expected)
})

test('Should fail to verify when an account address is mismatch', (t) => {
	const message = random()
	const id = random()
	const address = random()
	const pubSig = publicSignature({ message, id, address })
	const check = tryCatch<
		ReturnType<JWTVerifyWithoutCallback> | undefined,
		string
	>((sig: string, account: string) => verify(sig, account), always(undefined))
	const verified1 = check(pubSig, `0${address}`)
	const verified2 = check(pubSig, address.toLowerCase())
	const verified3 = check(pubSig, address.toUpperCase())
	t.is(verified1, undefined)
	t.is(verified2, undefined)
	t.is(verified3, undefined)
})

import test from 'ava'
import { sign } from 'jsonwebtoken'
import { publicSignature } from './publicSignature'

test('Returns signature from the passed message, address and sign method name', (t) => {
	const message = 'A'
	const address = 'B'
	const id = 'C'
	const expected = sign(`${message}-${address}`, id)
	const result = publicSignature(message, address, id)
	t.is(result, expected)
})

test('Returns the same result when the same arguments', (t) => {
	const random = (): string =>
		sign(Math.random().toString(), Math.random().toString())
	const message = random()
	const address = random()
	const id = random()
	const expected = sign(`${message}-${address}`, id)
	const result1 = publicSignature(message, address, id)
	const result2 = publicSignature(message, address, id)
	const result3 = publicSignature(message, address, id)
	t.is(result1, expected)
	t.is(result2, expected)
	t.is(result3, expected)
})

test('Returns the different result when the different arguments', (t) => {
	const random = (): string =>
		sign(Math.random().toString(), Math.random().toString())
	const message = random()
	const address = random()
	const id = random()
	const sig = sign(`${message}-${address}`, id)
	const result1 = publicSignature(`${message}_`, address, id)
	const result2 = publicSignature(message, `${address}_`, id)
	const result3 = publicSignature(message, address, `${id}_`)
	t.not(result1, sig)
	t.not(result2, sig)
	t.not(result3, sig)
})

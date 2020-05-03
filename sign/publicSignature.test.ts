import test from 'ava'
import { sign } from 'jsonwebtoken'
import { publicSignature } from './publicSignature'

test('Returns signature from the passed message, address and sign method name', (t) => {
	const message = 'A'
	const id = 'C'
	const address = 'B'
	const expected = sign(`%${message}%-%${id}%`, address)
	const result = publicSignature(message, id, address)
	t.is(result, expected)
})

test('Returns the same result when the same arguments', (t) => {
	const random = (): string =>
		sign(Math.random().toString(), Math.random().toString())
	const message = random()
	const id = random()
	const address = random()
	const expected = sign(`%${message}%-%${id}%`, address)
	const result1 = publicSignature(message, id, address)
	const result2 = publicSignature(message, id, address)
	const result3 = publicSignature(message, id, address)
	t.is(result1, expected)
	t.is(result2, expected)
	t.is(result3, expected)
})

test('Returns the different result when the different arguments', (t) => {
	const random = (): string =>
		sign(Math.random().toString(), Math.random().toString())
	const message = random()
	const id = random()
	const address = random()
	const sig = sign(`%${message}%-%${id}%`, address)
	const result1 = publicSignature(`${message}_`, id, address)
	const result2 = publicSignature(message, `${id}_`, address)
	const result3 = publicSignature(message, id, `${address}_`)
	t.not(result1, sig)
	t.not(result2, sig)
	t.not(result3, sig)
})

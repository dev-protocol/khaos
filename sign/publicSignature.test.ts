import test from 'ava'
import { sign } from 'jsonwebtoken'
import { publicSignature } from './publicSignature'

test('Returns signature from the passed message, address and sign method name', (t) => {
	const message = 'A'
	const id = 'C'
	const account = 'B'
	const expected = sign(`%${message}%-%${id}%`, account)
	const result = publicSignature({ message, id, account })
	t.is(result, expected)
})

test('Returns the same result when the same arguments', (t) => {
	const random = (): string =>
		sign(Math.random().toString(), Math.random().toString())
	const message = random()
	const id = random()
	const account = random()
	const expected = sign(`%${message}%-%${id}%`, account)
	const result1 = publicSignature({ message, id, account })
	const result2 = publicSignature({ message, id, account })
	const result3 = publicSignature({ message, id, account })
	t.is(result1, expected)
	t.is(result2, expected)
	t.is(result3, expected)
})

test('Returns the different result when the different arguments', (t) => {
	const random = (): string =>
		sign(Math.random().toString(), Math.random().toString())
	const message = random()
	const id = random()
	const account = random()
	const sig = sign(`%${message}%-%${id}%`, account)
	const result1 = publicSignature({ message: `0${message}`, id, account })
	const result2 = publicSignature({ message, id: `0${id}`, account })
	const result3 = publicSignature({ message, id, account: `0${account}` })
	t.not(result1, sig)
	t.not(result2, sig)
	t.not(result3, sig)
})

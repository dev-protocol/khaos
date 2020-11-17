import test from 'ava'
import { isNotNil } from './isNotNil'

test('Returns false when the passed value is null', (t) => {
	t.false(isNotNil(null))
})

test('Returns false when the passed value is undefined', (t) => {
	t.false(isNotNil(undefined))
})

test('Returns true when the passed value is 0', (t) => {
	t.true(isNotNil(0))
})

test('Returns true when the passed value is empty string', (t) => {
	t.true(isNotNil(''))
})

test('Returns true when the passed value is empty array', (t) => {
	t.true(isNotNil([]))
})

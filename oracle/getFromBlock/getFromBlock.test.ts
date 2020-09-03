/* eslint-disable functional/immutable-data */
import test from 'ava'
import { getFromBlock } from './getFromBlock'

test.serial(
	'If KHAOS_BLOCK_RANGE is not set, it returns the number minus 80..',
	async (t) => {
		const result = getFromBlock(100)
		t.is(result, 20)
	}
)

test.serial(
	'If undefined is passed, undefined will be returned.',
	async (t) => {
		const result = getFromBlock(undefined)
		t.is(result, undefined)
	}
)

test.serial(
	'Return the specified value minus the value you set for KHAOS_BLOCK_RANGE.',
	async (t) => {
		process.env.KHAOS_BLOCK_RANGE = '50'
		const result = getFromBlock(100)
		t.is(result, 50)
	}
)

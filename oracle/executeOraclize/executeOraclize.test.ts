import test from 'ava'
import { executeOraclize } from './executeOraclize'
import { publicSignature } from '../../sign/publicSignature/publicSignature'

test('Execute the oraclize function if the khaos id exists.', async (t) => {
	const sig = publicSignature({ id: 'A', message: 'B', address: 'D' })
	const result = await executeOraclize(
		'example',
		'mainnet'
	)({
		json: { i: 'example' },
		secret: {
			resource: {
				id: sig,
				address: 'D',
			},
		},
		eventData: {
			allData: [],
			publicSignature: sig,
		},
	} as any)
	t.is(result.khaosId, 'example')
	t.deepEqual(result.result, {
		message: 'B',
		status: 0,
		statusMessage: `mainnet ${sig}`,
	})
})

test('If the khaos id does not exist, the oraclize function is not executed and undefined is returned.', async (t) => {
	const result = await executeOraclize(
		'example2',
		'mainnet'
	)({
		json: { i: 'example2' },
		secret: { resource: { secret: 'dummy-secret2' } },
	} as any)
	t.is(result.khaosId, 'example2')
	t.is(result.result, undefined)
})

test('If the khaos id exists, but the passed secret is not set, the oraclize function is not executed and undefined is returned.', async (t) => {
	const result = await executeOraclize(
		'example',
		'mainnet'
	)({
		json: { i: 'example' },
		secret: {
			resource: undefined,
		},
	} as any)
	t.is(result.khaosId, 'example')
	t.is(result.result, undefined)
})

test('If the khaos id exists and the passed secret is correct, but failed recover the passed publicSignature the oraclize function is not executed and undefined is returned.', async (t) => {
	const result = await executeOraclize(
		'example',
		'mainnet'
	)({
		json: { i: 'example' },
		secret: {
			resource: {
				id: `0${publicSignature({ id: 'A', message: 'B', address: 'D' })}`,
				address: 'D',
			},
		},
	} as any)
	t.is(result.khaosId, 'example')
	t.is(result.result, undefined)
})

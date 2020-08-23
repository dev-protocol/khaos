import test from 'ava'
import { executeOraclize } from './executeOraclize'

test('Execute the oraclize function if the khaos id exists.', async (t) => {
	const result = await executeOraclize('example')({
		json: { i: 'example' },
		secret: { resource: { secret: 'dummy-secret' } },
	} as any)
	t.is(result.khaosId, 'example')
	t.is(result.result, undefined)
})

test('If the khaos id does not exist, the oraclize function is not executed and undefined is returned.', async (t) => {
	const result = await executeOraclize('example2')({
		json: { i: 'example2' },
		secret: { resource: { secret: 'dummy-secret2' } },
	} as any)
	t.is(result.khaosId, 'example2')
	t.is(result.result, undefined)
})

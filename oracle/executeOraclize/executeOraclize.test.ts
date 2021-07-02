import test from 'ava'
import { executeOraclize } from './executeOraclize'
import { publicSignature } from '@devprotocol/khaos-core'
import * as khaosFunctions from '@devprotocol/khaos-functions'
import { stub } from 'sinon'
import { createContext } from '../../common/testutils'

test.serial(
	'Execute the oraclize function if the khaos id exists.',
	async (t) => {
		const kStub = stub(khaosFunctions, 'call').callsFake(() => async () => ({
			data: {
				message: 'B',
				status: 0,
				statusMessage: 'message',
			} as any,
		}))

		const sig = publicSignature({ id: 'A', message: 'B', address: 'D' })
		const context = createContext()
		const result = await executeOraclize(
			context as any,
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
			statusMessage: 'message',
		})
		kStub.restore()
	}
)

test.serial(
	'Oraclize succeeds even when there is no connection to the DB.',
	async (t) => {
		const kStub = stub(khaosFunctions, 'call').callsFake(() => async () => ({
			data: {
				message: 'C',
				status: 0,
				statusMessage: 'message2',
			} as any,
		}))

		const context = createContext()
		const result = await executeOraclize(
			context as any,
			'example2',
			'mainnet'
		)({
			json: { i: 'example2' },
			secret: undefined,
			eventData: {},
		} as any)
		t.is(result.khaosId, 'example2')
		t.deepEqual(result.result, {
			message: 'C',
			status: 0,
			statusMessage: 'message2',
		})
		kStub.restore()
	}
)

test.serial(
	'If the khaos id does not exist, the oraclize function is not executed and undefined is returned.',
	async (t) => {
		const kStub = stub(khaosFunctions, 'call').callsFake(() => async () =>
			undefined
		)
		const context = createContext()
		const result = await executeOraclize(
			context as any,
			'example2',
			'mainnet'
		)({
			json: { i: 'example2' },
			secret: { resource: { secret: 'dummy-secret2' } },
		} as any)
		t.is(result.khaosId, 'example2')
		t.is(result.result, undefined)
		kStub.restore()
	}
)

test.serial(
	'If the ItemResponce isn undefined, return result is undefiend.',
	async (t) => {
		const kStub = stub(khaosFunctions, 'call').callsFake(() => async () =>
			undefined
		)
		const context = createContext()
		const result = await executeOraclize(
			context as any,
			'example2',
			'mainnet'
		)({
			json: { i: 'example2' },
			secret: undefined,
		} as any)
		t.is(result.khaosId, 'example2')
		t.is(result.result, undefined)
		kStub.restore()
	}
)

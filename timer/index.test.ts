/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/prefer-readonly-type */
import test from 'ava'
import { stub } from 'sinon'
import handleTimer from '.'
import * as idPprocess from '../oracle/idProcess/idProcess'

let passedNetwork = ''
const createContext = () => {
	const warn: string[] = []
	const info: string[] = []
	return {
		log: {
			warn: function (str: string) {
				warn.push(str)
			},
			info: function (str: string) {
				info.push(str)
			},
		},
		warn,
		info,
	}
}
const stubbedReader = stub(idPprocess, 'idProcess').callsFake(
	(network) => async () =>
		new Promise((resolve) => {
			passedNetwork = network
			resolve(undefined)
		})
)

test.after(() => {
	stubbedReader.restore()
})

test.serial(
	'Returns a function for the Azure functions that pass "mainnet" to `idProcess`',
	async (t) => {
		const context = createContext()
		process.env.KHAOS_NETWORK = 'mainnet'
		await handleTimer(context as any, {
			IsPastDue: false,
		})
		t.is(passedNetwork, 'mainnet')
	}
)

test.serial(
	'Returns a function for the Azure functions that pass "ropsten" to `idProcess`',
	async (t) => {
		const context = createContext()
		process.env.KHAOS_NETWORK = 'ropsten'
		await handleTimer(context as any, {
			IsPastDue: false,
		})
		t.is(passedNetwork, 'ropsten')
	}
)

test('If the call is not delayed, there is no warning message.', async (t) => {
	const context = createContext()
	process.env.KHAOS_NETWORK = 'mainnet'
	await handleTimer(context as any, {
		IsPastDue: false,
	})
	t.is(context.warn.length, 0)
	t.is(context.info.length, 2)
	t.is(context.info[0], 'event batch is started.')
	t.is(context.info[1], 'event batch is finished.')
})

test('If the call is delayed, you get a warning message.', async (t) => {
	const context = createContext()
	process.env.KHAOS_NETWORK = 'mainnet'
	await handleTimer(context as any, {
		IsPastDue: true,
	})
	t.is(context.warn.length, 1)
	t.is(context.warn[0], 'Timer function is running late!')
	t.is(context.info.length, 2)
	t.is(context.info[0], 'event batch is started.')
	t.is(context.info[1], 'event batch is finished.')
})

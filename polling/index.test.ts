/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-return-void */
import test from 'ava'
import { stub } from 'sinon'
import handleTimer from '.'
import * as idPprocess from '../oracle/idProcess/idProcess'
import { createContext } from '../common/testutils'

let passedNetwork = ''

const stubbedReader = stub(idPprocess, 'idProcess').callsFake(
	(_, network) => async () =>
		new Promise((resolve) => {
			passedNetwork = network
			resolve(undefined)
		})
)

test.after(() => {
	stubbedReader.restore()
})

test.serial(
	'Returns a function for the Azure functions that pass "mainnet" to `idProcess` when the process.env.KHAOS_NETWORK is mainnet',
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
	'Returns a function for the Azure functions that pass "ropsten" to `idProcess` when the process.env.KHAOS_NETWORK is ropsten',
	async (t) => {
		const context = createContext()
		process.env.KHAOS_NETWORK = 'ropsten'
		await handleTimer(context as any, {
			IsPastDue: false,
		})
		t.is(passedNetwork, 'ropsten')
	}
)

test.serial(
	'Returns a function for the Azure functions that pass "arbitrum-one" to `idProcess` when the process.env.KHAOS_NETWORK is arbitrum-one',
	async (t) => {
		const context = createContext()
		process.env.KHAOS_NETWORK = 'arbitrum-one'
		await handleTimer(context as any, {
			IsPastDue: false,
		})
		t.is(passedNetwork, 'arbitrum-one')
	}
)

test.serial(
	'Returns a function for the Azure functions that pass "arbitrum-rinkeby" to `idProcess` when the process.env.KHAOS_NETWORK is arbitrum-rinkeby',
	async (t) => {
		const context = createContext()
		process.env.KHAOS_NETWORK = 'arbitrum-rinkeby'
		await handleTimer(context as any, {
			IsPastDue: false,
		})
		t.is(passedNetwork, 'arbitrum-rinkeby')
	}
)

test.serial(
	'Returns a function for the Azure functions that pass "mainnet" to `idProcess` when the process.env.KHAOS_NETWORK is not set',
	async (t) => {
		const context = createContext()
		delete process.env.KHAOS_NETWORK
		await handleTimer(context as any, {
			IsPastDue: false,
		})
		t.is(passedNetwork, 'mainnet')
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

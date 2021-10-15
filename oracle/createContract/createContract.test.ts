/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-conditional-statement */
import test from 'ava'
import { createContract } from './createContract'
import { ethers } from 'ethers'
import * as khaos from '@devprotocol/khaos-functions'
import sinon from 'sinon'
import { createContext } from '../../common/testutils'

test.serial('returns [Contract, Provider, Wallet]', async (t) => {
	const stub = sinon
		.stub(khaos, 'call')
		.callsFake(() => async (options: any): Promise<any> => {
			switch (options.method) {
				case 'abi':
					return { data: ['event Query()'] }
				case 'addresses':
					t.is(options.options.network, 'ropsten')
					return { data: '0x3cb902625a2b38929f807f9c841f7aecbbce7702' }
				default:
					return undefined
			}
		})
	process.env.KHAOS_INFURA_ID = '8e44280aca0d4fbebad2f2849c39a83f'
	process.env.KHAOS_MNEMONIC =
		'size wish volume lecture dinner drastic easy assume pledge ribbon bunker stand drill grunt dutch'
	const context = createContext()
	const result = await createContract(context as any, 'test', 'ropsten')
	t.is(result.length, 3)
	t.true(result[0] instanceof ethers.Contract)
	t.true(result[1] instanceof ethers.providers.JsonRpcProvider)
	t.true(result[2] instanceof ethers.Wallet)
	t.is(result[0]?.address, '0x3cb902625a2b38929f807f9c841f7aecbbce7702')
	stub.restore()
})

test.serial(
	'returns [undefined, Provider, Wallet] when the result of khaosFunctions is undefined',
	async (t) => {
		const stub = sinon
			.stub(khaos, 'call')
			.callsFake(() => async (options: any): Promise<any> => {
				switch (options.method) {
					case 'abi':
						return { data: ['event Query()'] }
					case 'addresses':
						return undefined
					default:
						return undefined
				}
			})
		process.env.KHAOS_INFURA_ID = '8e44280aca0d4fbebad2f2849c39a83f'
		process.env.KHAOS_MNEMONIC =
			'size wish volume lecture dinner drastic easy assume pledge ribbon bunker stand drill grunt dutch'
		const context = createContext()
		const result = await createContract(context as any, 'test', 'mainnet')
		t.is(result.length, 3)
		t.is(result[0], undefined)
		t.true(result[1] instanceof ethers.providers.JsonRpcProvider)
		t.true(result[2] instanceof ethers.Wallet)
		stub.restore()
	}
)

test.serial(
	'returns [Contract, undefined, undefined] when the required environment variables is undefined',
	async (t) => {
		const stub = sinon
			.stub(khaos, 'call')
			.callsFake(() => async (options: any): Promise<any> => {
				switch (options.method) {
					case 'abi':
						return { data: ['event Query()'] }
					case 'addresses':
						return { data: '0x3cb902625a2b38929f807f9c841f7aecbbce7702' }
					default:
						return undefined
				}
			})
		delete process.env.KHAOS_INFURA_ID
		const context = createContext()
		const result = await createContract(context as any, 'test', 'mainnet')
		t.is(result.length, 3)
		t.true(result[0] instanceof ethers.Contract)
		t.is(result[1], undefined)
		t.is(result[2], undefined)
		stub.restore()
	}
)

test.serial(
	'returns [undefined, undefined, undefined] when the required environment variables is undefined and the result of khaosFunctions is undefined',
	async (t) => {
		const stub = sinon
			.stub(khaos, 'call')
			.callsFake(() => async (options: any): Promise<any> => {
				switch (options.method) {
					case 'abi':
						return { data: ['event Query()'] }
					case 'addresses':
						return undefined
					default:
						return undefined
				}
			})
		const context = createContext()
		const result = await createContract(context as any, 'test', 'mainnet')
		t.is(result.length, 3)
		t.is(result[0], undefined)
		t.is(result[1], undefined)
		t.is(result[2], undefined)
		stub.restore()
	}
)

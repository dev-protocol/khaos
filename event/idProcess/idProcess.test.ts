/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import test from 'ava'
import { idProcess, Results } from './idProcess'
import { stub } from 'sinon'
import { EventData } from 'web3-eth-contract'
import * as lastBlock from '../db/db'
import * as secret from '../../common/db/secret'

class Web3EventMock {
	readonly eth: any
	constructor(_: any) {
		this.eth = {
			getBlockNumber: function (): Promise<number> {
				return new Promise((resolve) => {
					resolve(650000)
				})
			},
			Contract: class Contract {
				readonly _abi: any
				readonly _address: string
				readonly methods: any
				constructor(abi: any, address: string) {
					this._abi = abi
					this._address = address
					this.methods = {}
					this.methods.khaosCallBack = function () {
						return {
							send: async function (_: string): Promise<void> {
								return new Promise((resolve) => {
									resolve()
								})
							},
						}
					}
				}
				public async getPastEvents(
					_: string,
					__: object
				): Promise<readonly EventData[]> {
					const event1: EventData = {
						returnValues: {
							_data: '{"key1":"value1"}',
						},
						raw: {
							data: 'dummy-raw1',
							topics: ['topics1-1', 'topics1-2'],
						},
						event: 'query',
						signature: 'dummy-signature1',
						logIndex: 10,
						transactionIndex: 100,
						transactionHash: 'dummy-transaction-hash1',
						blockHash: 'dummy-block-hash1',
						blockNumber: 10000,
						address: 'dummy-address1',
					}
					const event2: EventData = {
						returnValues: {
							_data: '{"key2":"value2"}',
						},
						raw: {
							data: 'dummy-raw2',
							topics: ['topics2-1', 'topics2-2'],
						},
						event: 'query',
						signature: 'dummy-signature2',
						logIndex: 20,
						transactionIndex: 200,
						transactionHash: 'dummy-transaction-hash2',
						blockHash: 'dummy-block-hash2',
						blockNumber: 20000,
						address: 'dummy-address2',
					}
					return new Promise((resolve) => {
						resolve([event1, event2])
					})
				}
			},
		}
	}
}

test.serial('The process is executed successfully.', async (t) => {
	const stubbedReader = stub(lastBlock, 'reader').callsFake(() => async () =>
		({
			statusCode: 200,
			resource: { lastBlock: 100 },
		} as any)
	)
	const stubbedSecretReader = stub(secret, 'reader').callsFake(() => async () =>
		({
			statusCode: 200,
			resource: { secret: 'dummy-secret' },
		} as any)
	)
	const web3 = new Web3EventMock('http://hogehoge')
	const result = await idProcess(web3 as any)('example')
	stubbedReader.restore()
	stubbedSecretReader.restore()
	t.is((result as readonly Results[])[0].address, '0x00......')
	t.is((result as readonly Results[])[1].address, '0x00......')
	t.is((result as readonly Results[])[0].sent, true)
	t.is((result as readonly Results[])[1].sent, true)
})
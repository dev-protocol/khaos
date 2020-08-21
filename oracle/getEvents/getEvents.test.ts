/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import test from 'ava'
import { getEvents } from './getEvents'
import { EventData } from 'web3-eth-contract'

// class Web3EventMock {
// 	readonly eth: any
// 	constructor(_: any) {
// 		this.eth = {
// 			Contract: class Contract {
// 				readonly _abi: any
// 				readonly _address: string
// 				constructor(abi: any, address: string) {
// 					this._abi = abi
// 					this._address = address
// 				}

// 				public async getPastEvents(
// 					_: string,
// 					__: Record<string, unknown>
// 				): Promise<readonly EventData[]> {
// 					const event1: EventData = {
// 						returnValues: {
// 							_data: {
// 								key1: 'value1',
// 							},
// 						},
// 						raw: {
// 							data: 'dummy-raw1',
// 							topics: ['topics1-1', 'topics1-2'],
// 						},
// 						event: 'query',
// 						signature: 'dummy-signature1',
// 						logIndex: 10,
// 						transactionIndex: 100,
// 						transactionHash: 'dummy-transaction-hash1',
// 						blockHash: 'dummy-block-hash1',
// 						blockNumber: 10000,
// 						address: 'dummy-address1',
// 					}
// 					const event2: EventData = {
// 						returnValues: {
// 							_data: {
// 								key2: 'value2',
// 							},
// 						},
// 						raw: {
// 							data: 'dummy-raw2',
// 							topics: ['topics2-1', 'topics2-2'],
// 						},
// 						event: 'query',
// 						signature: 'dummy-signature2',
// 						logIndex: 20,
// 						transactionIndex: 200,
// 						transactionHash: 'dummy-transaction-hash2',
// 						blockHash: 'dummy-block-hash2',
// 						blockNumber: 20000,
// 						address: 'dummy-address2',
// 					}
// 					return new Promise((resolve) => {
// 						resolve([event1, event2])
// 					})
// 				}
// 			},
// 		}
// 	}
// }

test('event information is coming back.', async (t) => {
	const events = await getEvents({} as any, 0, 100)
	t.is(events.length, 2)
})

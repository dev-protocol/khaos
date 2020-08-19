/* eslint-disable functional/no-let */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import test from 'ava'
import { sendContractMethod } from './sendContractMethod'

let count = 0
class Web3PropertyCallMock {
	readonly eth: any

	constructor(_: any) {
		this.eth = {
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
									count++
									resolve()
								})
							},
						}
					}
				}
			},
		}
	}
}

test('event information is coming back.', async (t) => {
	t.is(count, 0)
	const web3 = new Web3PropertyCallMock('dummy-url')
	await sendContractMethod(
		web3 as any,
		'dummy-address'
	)({ result: 'dummy-result' } as any)
	t.is(count, 1)
})

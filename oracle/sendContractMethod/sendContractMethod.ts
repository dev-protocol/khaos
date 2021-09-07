/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FunctionPackResults } from '@devprotocol/khaos-core'
import { whenDefinedAll } from '@devprotocol/util-ts'
import { ethers } from 'ethers'
import { estimateTransaction } from '../estimateTransaction/estimateTransaction'
import { createFastestGasPriceFetcher, ethgas } from './../gas/gas'

export const sendContractMethod =
	(marketBehavior: ethers.Contract) =>
	async (
		name: string,
		args: FunctionPackResults['args']
	): Promise<ethers.Transaction> => {
		const fastest = createFastestGasPriceFetcher(
			ethgas(process.env.KHAOS_EGS_TOKEN!)
		)
		const estimatedGasLimit = await estimateTransaction(marketBehavior)(
			name,
			args
		)
		return whenDefinedAll(
			[estimatedGasLimit, marketBehavior[name], args],
			async ([gasLimit, callback, _args]) =>
				callback(..._args, { gasLimit, gasPrice: await fastest() })
		)
	}

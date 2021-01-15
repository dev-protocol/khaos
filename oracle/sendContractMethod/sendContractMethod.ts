/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FunctionPackResults } from '@devprotocol/khaos-core'
import { whenDefinedAll } from '@devprotocol/util-ts'
import { ethers } from 'ethers'
import { createFastestGasPriceFetcher, ethgas } from './../gas/gas'

export const sendContractMethod = (marketBehavior: ethers.Contract) => async (
	name: string,
	args: FunctionPackResults['args']
): Promise<ethers.Transaction> => {
	const fastest = createFastestGasPriceFetcher(
		ethgas(process.env.KHAOS_EGS_TOKEN!)
	)
	const gas = Number(process.env.KHAOS_GAS_LIMIT || 1000000)
	const overrides = {
		gasLimit: gas,
		gasPrice: await fastest(),
	}
	return whenDefinedAll([marketBehavior[name], args], ([callback, _args]) =>
		callback(..._args, overrides)
	)
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { sendInfo } from '../executeOraclize/executeOraclize'
import { ethers } from 'ethers'
import { createFastestGasPriceFetcher, ethgas } from './../gas/gas'

export const sendContractMethod = (marketBehavior: ethers.Contract) => async (
	info: sendInfo
): Promise<ethers.Transaction> => {
	const fastest = createFastestGasPriceFetcher(
		ethgas(process.env.KHAOS_EGS_TOKEN!)
	)
	const gas = Number(process.env.KHAOS_GAS_LIMIT || 1000000)
	const overrides = {
		gasLimit: gas,
		gasPrice: await fastest(),
	}
	return marketBehavior.khaosCallback(
		info.result!.message,
		info.result!.status,
		info.result!.statusMessage,
		overrides
	)
}

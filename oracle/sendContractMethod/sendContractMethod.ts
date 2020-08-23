/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { sendInfo } from '../executeOraclize/executeOraclize'
import { ethers } from 'ethers'
import { createFastestGasPriceFetcher, ethgas } from './../gas/gas'

const gas = 7000000

export const sendContractMethod = (marketBehavior: ethers.Contract) => async (
	info: sendInfo
): Promise<boolean> => {
	const fastest = await createFastestGasPriceFetcher(
		ethgas(process.env.EGS_TOKEN!)
	)
	const overrides = {
		gasLimit: gas,
		gasPrice: fastest,
	}
	const sent = marketBehavior.khaosCallback(
		info.result!.message,
		info.result!.status,
		info.result!.statusMessage,
		overrides
	)
	return sent instanceof Promise
}

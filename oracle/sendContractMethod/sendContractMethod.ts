import { sendInfo } from '../executeOraclize/executeOraclize'
import { ethers } from 'ethers'
import { NetworkName } from '../../functions/address'
import Web3 from 'web3'
import { createFastestGasPriceFetcher, ethgas } from './../gas/gas'

const gas = 7000000

export const sendContractMethod = (
	web3: Web3,
	address: string,
	network: NetworkName
) => async (info: sendInfo): Promise<boolean> => {
	const provider = ethers.getDefaultProvider(network, {
		infura: process.env.INFURA_ID,
	})
	const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC!).connect(
		provider
	)
	const marketBehavior = new ethers.Contract(
		address,
		['function khaosCallback(bytes memory _data) external'],
		wallet
	)
	// TODO replace ethers....
	const fastest = await createFastestGasPriceFetcher(
		ethgas(process.env.EGS_TOKEN!),
		web3
	)
	const overrides = {
		gasLimit: gas,
		gasPrice: fastest,
	}
	const sent = marketBehavior.khaosCallback(info.result, overrides)
	return sent instanceof Promise
}

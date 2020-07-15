import { sendInfo } from '../executeOraclize/executeOraclize'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'

const CALLBACK_ABI = [
	{
		constant: false,
		inputs: [{ internalType: 'string', name: '_data', type: 'string' }],
		name: 'khaosCallback',
		outputs: [],
		payable: false,
		stateMutability: 'nonpayable',
		type: 'function',
	},
] as readonly AbiItem[]

export const sendContractMethod = (web3: Web3, address: string) => async (
	info: sendInfo
): Promise<boolean> => {
	const callbackInstance = new web3.eth.Contract([...CALLBACK_ABI], address)
	const sent = callbackInstance.methods.khaosCallBack().send(info.result)
	return sent instanceof Promise
}

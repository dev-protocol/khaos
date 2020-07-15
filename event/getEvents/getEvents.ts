import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { EventData } from 'web3-eth-contract'

const ABI = [
	{
		anonymous: false,
		inputs: [
			{ indexed: false, internalType: 'string', name: '_data', type: 'string' },
		],
		name: 'Query',
		type: 'event',
	},
] as readonly AbiItem[]

export const getEvents = async (
	web3: Web3,
	address: string,
	firstBlock: number,
	lastBlock: number
): Promise<readonly EventData[]> => {
	const contract = new web3.eth.Contract([...ABI], address)
	return contract.getPastEvents('query', {
		fromBlock: firstBlock,
		toBlock: lastBlock,
	})
}

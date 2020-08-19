import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { EventData } from 'web3-eth-contract'

const ABI = [
	{
		anonymous: false,
		inputs: [
			{
				components: [
					{
						internalType: 'bytes32',
						name: 'key',
						type: 'bytes32',
					},
					{
						internalType: 'string',
						name: 'publicSignature',
						type: 'string',
					},
					{
						internalType: 'string',
						name: 'additionalData',
						type: 'string',
					},
				],
				indexed: false,
				//internalType: 'struct GitHubMarket.QueryData',  ここ消したらあかんかも。。。
				name: '_data',
				type: 'tuple',
			},
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
	return contract.getPastEvents('Query', {
		fromBlock: firstBlock,
		toBlock: lastBlock,
	})
}

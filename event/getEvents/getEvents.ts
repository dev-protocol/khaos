/* eslint-disable @typescript-eslint/no-explicit-any */
const ABI =
	'[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"_data","type":"string"}],"name":"Query","type":"event"}]'

export const getEvents = async (
	web3: any,
	address: string,
	firstBlock: number,
	lastBlock: number
): Promise<ReadonlyArray<ReadonlyMap<string, any>>> => {
	const contract = await new web3.eth.Contract(ABI, address)
	const events = await contract.getPastEvents('query', {
		fromBlock: firstBlock,
		toBlock: lastBlock,
	})
	return events
}

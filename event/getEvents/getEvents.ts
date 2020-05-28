// TODO 環境変数とかにする
const ABI = '[]'

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

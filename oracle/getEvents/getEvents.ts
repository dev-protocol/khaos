import { ethers } from 'ethers'

export const getEvents = async (
	marketBehavior: ethers.Contract,
	firstBlock: number,
	lastBlock: number
): Promise<readonly ethers.Event[]> => {
	const filter = marketBehavior.filters.Query()
	const events = await marketBehavior.queryFilter(filter, firstBlock, lastBlock)
	return events
}

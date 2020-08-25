import { ethers } from 'ethers'
import { when } from '../../common/util/when'

export const getEvents = async (
	marketBehavior: ethers.Contract,
	firstBlock: number,
	lastBlock: number
): Promise<readonly ethers.Event[] | undefined> => {
	const filter = when(marketBehavior.filters.Query, (query) => query())
	const events = await when(filter, (filt) =>
		marketBehavior.queryFilter(filt, firstBlock, lastBlock)
	)
	return events
}

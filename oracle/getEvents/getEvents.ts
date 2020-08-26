import { ethers } from 'ethers'
import { whenDefined } from '../../common/util/whenDefined'

export const getEvents = async (
	marketBehavior: ethers.Contract,
	firstBlock: number,
	lastBlock: number
): Promise<readonly ethers.Event[] | undefined> => {
	const filter = whenDefined(marketBehavior.filters.Query, (query) => query())
	const events = await whenDefined(filter, (filt) =>
		marketBehavior.queryFilter(filt, firstBlock, lastBlock)
	)
	return events
}

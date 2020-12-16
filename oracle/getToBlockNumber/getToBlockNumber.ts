import { ethers } from 'ethers'
import { whenDefined } from '@devprotocol/util-ts'

export const getToBlockNumber = async (
	provider: ethers.providers.BaseProvider
): Promise<number | undefined> => {
	const currentBlockNumber = await whenDefined(provider, (prov) =>
		prov.getBlockNumber()
	)
	return currentBlockNumber
}

import { ethers } from 'ethers'
import { when } from '../../common/util/when'

export const getToBlockNumber = async (
	provider: ethers.providers.BaseProvider
): Promise<number | undefined> => {
	const currentBlockNumber = await when(provider, (prov) =>
		prov.getBlockNumber()
	)
	return typeof currentBlockNumber === 'undefined'
		? undefined
		: currentBlockNumber - Number(process.env.KHAOS_APPROVAL)
}

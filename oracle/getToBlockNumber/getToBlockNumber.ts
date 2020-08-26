import { ethers } from 'ethers'
import { whenDefined } from '../../common/util/whenDefined'

export const getToBlockNumber = async (
	provider: ethers.providers.BaseProvider
): Promise<number | undefined> => {
	const currentBlockNumber = await whenDefined(provider, (prov) =>
		prov.getBlockNumber()
	)

	return whenDefined(
		currentBlockNumber,
		(number) => number - Number(process.env.KHAOS_APPROVAL)
	)
}

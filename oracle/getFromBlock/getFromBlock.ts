import { whenDefined } from '../../common/util/whenDefined'

export const getFromBlock = async (
	toBlockNumber: number | undefined
): Promise<number | undefined> => {
	const fromBlockNumber = whenDefined(toBlockNumber, (to) =>
		whenDefined(process.env.KHAOS_BLOCK_RANGE, (range) => to - Number(range))
	)
	return fromBlockNumber
}

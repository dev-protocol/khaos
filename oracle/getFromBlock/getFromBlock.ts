import { whenDefined } from '@devprotocol/util-ts'

export const getFromBlock = (
	toBlockNumber: number | undefined
): number | undefined => {
	const range = Number(process.env.KHAOS_BLOCK_RANGE || 80)
	const fromBlockNumber = whenDefined(toBlockNumber, (to) => to - Number(range))
	return fromBlockNumber
}

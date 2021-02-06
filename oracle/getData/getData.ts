import { ethers } from 'ethers'
import { mergeAll } from 'ramda'
import { MarketQueryData } from '../../common/structs'

export const getData = function (event: ethers.Event): MarketQueryData {
	const src = event.args || []
	const keys = Object.keys(src)
	const data = keys.map((key) => ({ [key]: src[key] }))
	const allData = mergeAll(data)
	return {
		publicSignature: allData.publicSignature,
		allData,
		transactionhash: event.transactionHash,
	} as MarketQueryData
}

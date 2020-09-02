import { ethers } from 'ethers'
import { MarketQueryData } from '../../common/structs'

export const getData = function (event: ethers.Event): MarketQueryData {
	return {
		publicSignature: event.args?.['publicSignature'],
		allData: event.args,
		transactionhash: event.transactionHash,
	} as MarketQueryData
}

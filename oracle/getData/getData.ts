import { ethers } from 'ethers'
import { Result } from '@ethersproject/abi'

export type MarketQueryData = {
	readonly publicSignature: string
	readonly allData: Result
}

export const getData = function (event: ethers.Event): MarketQueryData {
	return {
		publicSignature: event.args?.get('publicSignature'),
		allData: event.args,
	} as MarketQueryData
}

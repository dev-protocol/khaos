import { ethers } from 'ethers'

export type MarketQueryData = {
	readonly publicSignature: string
	readonly allData: any
}

export const getData = function (event: ethers.Event): MarketQueryData {
	const data = JSON.parse(event.data)

	return {
		publicSignature: data.publicSignature,
		allData: data,
	} as MarketQueryData
}

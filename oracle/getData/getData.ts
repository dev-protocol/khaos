import { ethers } from 'ethers'

export type MarketEventData = {
	readonly publicSignature: string
}

export const getData = function (event: ethers.Event): MarketEventData {
	const result: MarketEventData = {
		publicSignature: JSON.parse(event.data)._publicSignature,
	}
	return result
}

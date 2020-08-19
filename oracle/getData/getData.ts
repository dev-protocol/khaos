import { EventData } from 'web3-eth-contract'

export type KhaosEventData = {
	readonly key: string
	readonly publicSignature: string
	readonly additionalData: string
}

export const getData = function (event: EventData): KhaosEventData {
	const data: string = event.returnValues._data
	return JSON.parse(data) as KhaosEventData
}

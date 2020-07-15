import { EventData } from 'web3-eth-contract'

export type KhaosEventData = {
	readonly s: string
	readonly a: string
	readonly k: string
	readonly i: string
}

export const getData = function (event: EventData): KhaosEventData {
	const data: string = event.returnValues._data
	return JSON.parse(data) as KhaosEventData
}

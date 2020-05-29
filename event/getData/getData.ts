import { EventData } from 'web3-eth-contract'

export const getData = function (event: EventData): any {
	const data = event.returnValues._data
	return JSON.parse(data)
}

import { ethers } from 'ethers'

export type KhaosEventData = {
	readonly key: string
	readonly publicSignature: string
	readonly additionalData: string
}

export const getData = function (event: ethers.Event): KhaosEventData {
	const data: string = event.data
	const abi = new ethers.utils.AbiCoder()
	const encoded = abi.decode(['tuple(bytes32, string, string)'], data)
	const result: KhaosEventData = {
		key: encoded[0][0],
		publicSignature: encoded[0][1],
		additionalData: encoded[0][2],
	}
	return result
}

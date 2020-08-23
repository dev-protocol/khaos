import { Oraclize } from '../oraclize'
import Web3 from 'web3'
import { ethers } from 'ethers'
import bent from 'bent'
import { tryCatch, always } from 'ramda'
import { when } from '../../common/util/when'

export type QueryAdditionalDataData = {
	readonly repository: string
	readonly property: string
}



const fn: Oraclize = async (secret, account, publicSignature) => {
	// TODO publicSignature とアカウントのペアから message, id(e.g., github-market) を返す関数用意

	// const additionalData = when(
	// 	data.additionalData,
	// 	tryCatch(
	// 		(adata) => JSON.parse(adata) as QueryAdditionalDataData,
	// 		always(undefined)
	// 	)
	// )
	// const repos = when(secret, (adata) => adata.repository.split('/'))
	// const permission = await when(repos, ([owner, repository]) =>
	// 	postViewerPermission(repository, owner, secret)
	// )
	// const result = when(permission, ([status, message]) =>
	// 	getResult(data, status, message)
	// )
	// return result ? result : getResult(data, 2, 'error')
	return ""
}

export default fn

// function getResult(
// 	data: KhaosEventData,
// 	status: number,
// 	message: string
// ): string {
// 	const additionalData = when(
// 		data.additionalData,
// 		tryCatch(
// 			(adata) => JSON.parse(adata) as QueryAdditionalDataData,
// 			always(undefined)
// 		)
// 	)
// 	const resultAdditionalData = when(additionalData, (adata) => ({
// 		repository: adata.repository,
// 		property: Web3.utils.toChecksumAddress(adata.property),
// 		status: status,
// 		message: message,
// 	}))
// 	const abi = new ethers.utils.AbiCoder()
// 	const result = abi.encode(
// 		['tuple(bytes32, string)'],
// 		[[data.key, JSON.stringify(resultAdditionalData)]]
// 	)
// 	return result
// }


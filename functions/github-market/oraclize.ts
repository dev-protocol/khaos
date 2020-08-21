import { Oraclize } from '../oraclize'
import Web3 from 'web3'
import { ethers } from 'ethers'
import { KhaosEventData } from './../../oracle/getData/getData'
import bent from 'bent'
import { tryCatch, always } from 'ramda'
import { when } from '../../common/util/when'

export type QueryAdditionalDataData = {
	readonly repository: string
	readonly property: string
}

type GraphQLResponse = {
	readonly data: {
		readonly repository: {
			readonly viewerPermission: string
		} | null
	}
	readonly errors?: readonly [{ readonly message: string }]
}

const fn: Oraclize = async (opts, data) => {
	const additionalData = when(
		data.additionalData,
		tryCatch(
			(adata) => JSON.parse(adata) as QueryAdditionalDataData,
			always(undefined)
		)
	)
	const test = when(
		additionalData,
		({ repository }) => repository === opts.message
	)
	return test ? getResult(data, 0, 'success') : getResult(data, 2, 'error')
}

export default fn

function getResult(
	data: KhaosEventData,
	status: number,
	message: string
): string {
	const additionalData = when(
		data.additionalData,
		tryCatch(
			(adata) => JSON.parse(adata) as QueryAdditionalDataData,
			always(undefined)
		)
	)
	const resultAdditionalData = when(additionalData, (adata) => ({
		repository: adata.repository,
		property: Web3.utils.toChecksumAddress(adata.property),
		status: status,
		message: message,
	}))
	const abi = new ethers.utils.AbiCoder()
	const result = abi.encode(
		['tuple(bytes32, string)'],
		[[data.key, JSON.stringify(resultAdditionalData) || '']]
	)
	return result
}

async function postViewerPermission(
	name: string,
	owner: string,
	token: string
): Promise<readonly [number, string]> {
	const res = await post(name, owner, token)
	return res instanceof Error
		? [2, 'http error']
		: res.errors
		? [2, res.errors[0].message]
		: res.data.repository
		? res.data.repository.viewerPermission === 'ADMIN'
			? [0, 'success']
			: [1, 'not admin']
		: [3, 'unexpected error']
}

async function post(
	name: string,
	owner: string,
	token: string
): Promise<GraphQLResponse | Error> {
	const query = `query {
		repository(name: "${name}", owner: "${owner}") {
			viewerPermission
		}
	}`
	const authorization = `bearer ${token}`
	return bent('https://api.github.com/graphql', 'json', 'POST')(
		'',
		{
			query,
		},
		{
			Authorization: authorization,
			'User-Agent': 'https://github.com/dev-protocol/khaos',
		}
	)
		.then((res) => (res as unknown) as GraphQLResponse)
		.catch((err: Error) => err)
}

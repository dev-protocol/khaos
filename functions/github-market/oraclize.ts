/* eslint-disable functional/no-expression-statement */

import { Oraclize } from '../oraclize'
import Web3 from 'web3'
import { ethers } from 'ethers'
import { AxiosResponse } from 'axios'
import axios from 'axios'
import { KhaosEventData } from './../../oracle/getData/getData'

export type QueryAdditionalDataData = {
	readonly repository: string
	readonly property: string
}

const fn: Oraclize = async (secret, data) => {
	const additionalData = JSON.parse(
		data.additionalData
	) as QueryAdditionalDataData
	const [user, repository] = additionalData.repository.split('/')
	// eslint-disable-next-line functional/no-try-statement
	try {
		const [status, message] = await postViewerPermission(
			repository,
			user,
			secret
		)
		return getResult(data, status, message)
	} catch (e) {
		return getResult(data, 2, e.message)
	}
}

export default fn

function getResult(
	data: KhaosEventData,
	status: number,
	message: string
): string {
	const additionalData = JSON.parse(
		data.additionalData
	) as QueryAdditionalDataData
	const resultAdditionalData = {
		repository: additionalData.repository,
		property: Web3.utils.toChecksumAddress(additionalData.property),
		status: status,
		message: message,
	}
	const abi = new ethers.utils.AbiCoder()
	const result = abi.encode(
		['tuple(bytes32, string)'],
		[[data.key, JSON.stringify(resultAdditionalData)]]
	)
	return result
}

async function postViewerPermission(
	name: string,
	owner: string,
	token: string
): Promise<readonly [number, string]> {
	const res = await post(name, owner, token)
	// eslint-disable-next-line functional/no-conditional-statement
	if (res.status !== 200 || typeof res.data.errors !== 'undefined') {
		return [2, res.data.errors[0].message]
	}
	return res.data.data.repository.viewerPermission === 'ADMIN'
		? [0, 'success']
		: [1, 'not admin']
}

async function post(
	name: string,
	owner: string,
	token: string
): Promise<AxiosResponse> {
	const queryStr = `{repository(name: "${name}", owner: "${owner}") {viewerPermission} }`
	const authorization = `bearer ${token}`
	const res = await axios.post(
		'https://api.github.com/graphql',
		{
			query: queryStr,
		},
		{
			headers: {
				Authorization: authorization,
			},
			responseType: 'json',
		}
	)
	return res
}

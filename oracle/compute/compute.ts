/* eslint-disable functional/no-expression-statement */
import { FunctionPackResults, NetworkName } from '@devprotocol/khaos-core'
import { ethers } from 'ethers'
import { executeOraclize, sendInfo } from '../executeOraclize/executeOraclize'
import { getData } from '../getData/getData'
import { getSecret } from '../getSecret/getSecret'
import { call } from '@devprotocol/khaos-functions'
import { UndefinedOr } from '@devprotocol/util-ts'
import { MarketQueryData } from '../../common/structs'

type Compute = (
	event: ethers.Event
) => Promise<{
	readonly query: MarketQueryData
	readonly oraclized: sendInfo
	readonly packed: UndefinedOr<{
		readonly data: UndefinedOr<FunctionPackResults>
	}>
}>

export const compute = (id: string, network: NetworkName): Compute => {
	const oracle = executeOraclize(id, network)
	const khaosFunctions = call()
	return async (event: ethers.Event): ReturnType<Compute> => {
		const query = getData(event)

		console.log(`query.allData:${query.allData}`)
		console.log(`query.publicSignature:${query.publicSignature}`)
		console.log(`query.transactionhash:${query.transactionhash}`)

		const oracleArgs = await getSecret(query)

		console.log(`oracleArgs.secret:${oracleArgs.secret}`)

		const oraclized = await oracle(oracleArgs)
		console.log(`oraclized.khaosId:${oraclized.khaosId}`)
		console.log(`oraclized.result.message:${oraclized.result?.message}`)
		console.log(`oraclized.result.status:${oraclized.result?.status}`)
		console.log(`oraclized.result.statusMessage:${oraclized.result?.statusMessage}`)

		const packed = await khaosFunctions({
			id,
			method: 'pack',
			options: { results: oraclized.result },
		})
		return { query, oraclized, packed }
	}
}

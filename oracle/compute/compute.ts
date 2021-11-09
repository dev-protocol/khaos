/* eslint-disable functional/no-expression-statement */
import { Context } from '@azure/functions'
import { FunctionPackResults, NetworkName } from '@devprotocol/khaos-core'
import { ethers } from 'ethers'
import { executeOraclize, sendInfo } from '../executeOraclize/executeOraclize'
import { getData } from '../getData/getData'
import { getSecret } from '../getSecret/getSecret'
import { call } from '@devprotocol/khaos-functions'
import { UndefinedOr } from '@devprotocol/util-ts'
import { MarketQueryData } from '../../common/structs'

type Compute = (event: ethers.Event) => Promise<{
	readonly query: MarketQueryData
	readonly oraclized: sendInfo
	readonly packed: UndefinedOr<{
		readonly data: UndefinedOr<FunctionPackResults>
	}>
}>

export const compute = (
	context: Context,
	id: string,
	network: NetworkName
): Compute => {
	const oracle = executeOraclize(context, id, network)
	const khaosFunctions = call()
	return async (event: ethers.Event): ReturnType<Compute> => {
		const query = getData(event)
		context.log.info(`id:${id} query publicSignature:${query.publicSignature}`)
		context.log.info(`id:${id} query transactionhash:${query.transactionhash}`)
		const oracleArgs = await getSecret(query)
		context.log.info(`id:${id} oracleArgs secret:${oracleArgs.secret}`)
		const oraclized = await oracle(oracleArgs)
		const packed =
			typeof oraclized.result === 'undefined'
				? undefined
				: await khaosFunctions({
						id,
						method: 'pack',
						options: { results: oraclized.result },
				  })
		return { query, oraclized, packed }
	}
}

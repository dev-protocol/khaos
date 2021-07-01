import { Context } from '@azure/functions'
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

export const compute = (context: Context, id: string, network: NetworkName): Compute => {
	const oracle = executeOraclize(id, network)
	const khaosFunctions = call()
	return async (event: ethers.Event): ReturnType<Compute> => {
		// TODO 後でログを消す
		const query = getData(event)

		// eslint-disable-next-line functional/no-expression-statement
		context.log.info(`id:${id} compute:query.publicSignature:${query.publicSignature}`)
		// eslint-disable-next-line functional/no-expression-statement
		context.log.info(`id:${id} compute:query.transactionhash:${query.transactionhash}`)
		// eslint-disable-next-line functional/no-expression-statement
		context.log.info(`id:${id} compute:query.allData:${query.allData}`)
		const oracleArgs = await getSecret(query)
		// eslint-disable-next-line functional/no-expression-statement
		context.log.info(`id:${id} compute:oracleArgs.secret:${oracleArgs.secret}`)
		const oraclized = await oracle(oracleArgs)
		// eslint-disable-next-line functional/no-expression-statement
		context.log.info(`id:${id} compute:oraclized.khaosId:${oraclized.khaosId}`)
		// eslint-disable-next-line functional/no-expression-statement
		context.log.info(`id:${id} compute:oraclized.result?.message:${oraclized.result?.message}`)
		// eslint-disable-next-line functional/no-expression-statement
		context.log.info(`id:${id} compute:oraclized.result?.status:${oraclized.result?.status}`)
		// eslint-disable-next-line functional/no-expression-statement
		context.log.info(`id:${id} compute:oraclized.result?.statusMessage:${oraclized.result?.statusMessage}`)
		const packed = typeof oraclized.result === 'undefined' ? undefined : await khaosFunctions({
			id,
			method: 'pack',
			options: { results: oraclized.result },
		})
		return { query, oraclized, packed }
	}
}

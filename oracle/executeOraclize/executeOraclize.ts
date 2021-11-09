/* eslint-disable functional/no-expression-statement */
import { Context } from '@azure/functions'
import { oracleArgInfo } from './../getSecret/getSecret'
import {
	recoverPublicSignature,
	FunctionOraclizeResults,
} from '@devprotocol/khaos-core'
import { whenDefined } from '@devprotocol/util-ts'
import { NetworkName } from '../../common/types'
import { call } from '@devprotocol/khaos-functions'

export type sendInfo = {
	readonly khaosId: string
	readonly result?: FunctionOraclizeResults
}

export const executeOraclize =
	(context: Context, id: string, network: NetworkName) =>
	async (info: oracleArgInfo): Promise<sendInfo> => {
		const oraclize = call()
		const tmp = whenDefined(info.secret?.resource, ({ id, address }) =>
			recoverPublicSignature(id, address)
		)
		const signatureOptions =
			typeof tmp === 'undefined' ? { message: '', id: '', address: '' } : tmp
		context.log.info(`id:${id} executeOraclize network:${network}`)
		context.log.info(
			`id:${id} executeOraclize info.eventData.publicSignature:${info.eventData.publicSignature}`
		)
		context.log.info(
			`id:${id} executeOraclize info.eventData.transactionhash:${info.eventData.transactionhash}`
		)
		const callBack = await oraclize({
			id,
			method: 'oraclize',
			options: { signatureOptions, query: info.eventData, network },
		})
		return {
			khaosId: id,
			result: typeof callBack === 'undefined' ? undefined : callBack.data,
		}
	}

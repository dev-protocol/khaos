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

		// eslint-disable-next-line functional/no-expression-statement
		context.log.info(`id:${id} oracle id:${info.secret?.resource?.id}`)
		// eslint-disable-next-line functional/no-expression-statement
		context.log.info(`id:${id} oracle address:${info.secret?.resource?.address}`)

		const tmp = whenDefined(info.secret?.resource, ({ id, address }) =>
			recoverPublicSignature(id, address)
		)
		const signatureOptions =
			typeof tmp === 'undefined' ? { message: '', id: '', address: '' } : tmp

		// eslint-disable-next-line functional/no-expression-statement
		context.log.info(`id:${id} oracle signatureOptions id:${signatureOptions?.id}`)
		// eslint-disable-next-line functional/no-expression-statement
		context.log.info(`id:${id} oracle signatureOptions message:${signatureOptions?.message}`)
		// eslint-disable-next-line functional/no-expression-statement
		context.log.info(`id:${id} oracle signatureOptions address:${signatureOptions?.address}`)

		const callBack = await oraclize({
			id,
			method: 'oraclize',
			options: { signatureOptions, query: info.eventData, network },
		})

		// eslint-disable-next-line functional/no-expression-statement
		context.log.info(`id:${id} oracle callBack message:${callBack?.data?.message}`)
		// eslint-disable-next-line functional/no-expression-statement
		context.log.info(`id:${id} oracle callBack status:${callBack?.data?.status}`)
		// eslint-disable-next-line functional/no-expression-statement
		context.log.info(`id:${id} oracle callBack statusMessage:${callBack?.data?.statusMessage}`)

		return {
			khaosId: id,
			result: typeof callBack === 'undefined' ? undefined : callBack.data,
		}
	}

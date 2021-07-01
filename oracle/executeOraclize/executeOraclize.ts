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

export const executeOraclize = (context: Context, id: string, network: NetworkName) => async (
	info: oracleArgInfo
): Promise<sendInfo> => {
	const oraclize = call()
	const signatureOptions = whenDefined(
		info.secret?.resource,
		({ id, address }) => recoverPublicSignature(id, address)
	)
	// TODO ログを消す
	// eslint-disable-next-line functional/no-expression-statement
	context.log.info(`id:${id} executeOraclize:signatureOptions:${signatureOptions}`)
	// eslint-disable-next-line functional/no-expression-statement
	context.log.info(`id:${id} executeOraclize:signatureOptions?.address:${signatureOptions?.address}`)
	// eslint-disable-next-line functional/no-expression-statement
	context.log.info(`id:${id} executeOraclize:signatureOptions?.id:${signatureOptions?.id}`)
	// eslint-disable-next-line functional/no-expression-statement
	context.log.info(`id:${id} executeOraclize:signatureOptions?.message:${signatureOptions?.message}`)
	// eslint-disable-next-line functional/no-expression-statement
	context.log.info(`id:${id} executeOraclize:network:${network}`)
	// eslint-disable-next-line functional/no-expression-statement
	context.log.info(`id:${id} executeOraclize:info.eventData.transactionhash:${info.eventData?.transactionhash}`)
	// eslint-disable-next-line functional/no-expression-statement
	context.log.info(`id:${id} executeOraclize:info.eventData.publicSignature:${info.eventData?.publicSignature}`)
	const callBack = await oraclize({
		id,
		method: 'oraclize',
		options: { signatureOptions, query: info.eventData, network },
	})
	// eslint-disable-next-line functional/no-expression-statement
	context.log.info(`id:${id} executeOraclize:callBack:${callBack}`)
	// eslint-disable-next-line functional/no-expression-statement
	context.log.info(`id:${id} executeOraclize:callBack?.data:${callBack?.data}`)
	return {
		khaosId: id,
		result: typeof callBack === 'undefined' ? undefined : callBack.data,
	}
}

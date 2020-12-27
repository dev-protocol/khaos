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

export const executeOraclize = (id: string, network: NetworkName) => async (
	info: oracleArgInfo
): Promise<sendInfo> => {
	const oraclize = call()
	const recoverd = whenDefined(info.secret.resource, ({ id, address }) =>
		recoverPublicSignature(id, address)
	)
	const callBack = await whenDefined(recoverd, (signatureOptions) =>
		oraclize({
			id,
			method: 'oraclize',
			options: { signatureOptions, query: info.eventData, network },
		})
	)
	return {
		khaosId: id,
		result: typeof callBack === 'undefined' ? undefined : callBack.data,
	}
}

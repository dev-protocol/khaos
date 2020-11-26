import { oracleArgInfo } from './../getSecret/getSecret'
import { importOraclize } from '../importOraclize/importOraclize'
import { recoverPublicSignature } from '../../sign/publicSignature/recoverPublicSignature'
import { KhaosCallbackArg } from '../../functions/oraclize'
import { whenDefined } from '@devprtcl/util-ts'

export type sendInfo = {
	readonly khaosId: string
	readonly result?: KhaosCallbackArg
}

export const executeOraclize = (id: string) => async (
	info: oracleArgInfo
): Promise<sendInfo> => {
	const oraclize = await importOraclize(id)
	const recoverd = whenDefined(info.secret.resource, ({ id, address }) =>
		recoverPublicSignature(id, address)
	)
	const callBack = await whenDefined(recoverd, (r) =>
		oraclize(r, info.eventData)
	)
	return {
		khaosId: id,
		result: typeof callBack === 'undefined' ? undefined : callBack,
	}
}

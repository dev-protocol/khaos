import { oracleArgInfo } from './../getSecret/getSecret'
import { importOraclize } from '../importOraclize/importOraclize'
import { when } from '../../common/util/when'
import { recoverPublicSignature } from '../../sign/publicSignature/recoverPublicSignature'

export type sendInfo = {
	readonly khaosId: string
	readonly result?: string
}

export const executeOraclize = (id: string) => async (
	info: oracleArgInfo
): Promise<sendInfo> => {
	const oraclize = await importOraclize(id)
	const recoverd = when(info.secret.resource, ({ id, address }) =>
		recoverPublicSignature(id, address)
	)
	const result = await when(recoverd, (r) => oraclize(r, info.eventData))
	return {
		khaosId: id,
		result: typeof result === 'string' ? result : undefined,
	}
}

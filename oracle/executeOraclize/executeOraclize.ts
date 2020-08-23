import { oracleArgInfo } from './../getSecret/getSecret'
import { importOraclize } from '../importOraclize/importOraclize'
import { when } from '../../common/util/when'

export type sendInfo = {
	readonly khaosId: string
	readonly result?: string
}

export const executeOraclize = (id: string) => async (
	info: oracleArgInfo
): Promise<sendInfo> => {
	const oraclize = await importOraclize(id)
	const result = await when(info.secret.resource, ({ secret, account }) =>
		oraclize(secret, account, info.eventData.publicSignature)
	)
	return {
		khaosId: id,
		result: typeof result === 'string' ? result : undefined,
	}
}

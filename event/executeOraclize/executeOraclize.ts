import { oracleArgInfo } from './../getSecret/getSecret'
import { importOraclize } from '../importOraclize/importOraclize'
import { when } from '../../common/util/when'

export type sendInfo = {
	readonly khaosId: string
	readonly result?: string
}

export const executeOraclize = async (
	info: oracleArgInfo
): Promise<sendInfo> => {
	const oraclize = await importOraclize(info.json.i)
	const result = await when(info.secret.resource, ({ secret }) =>
		oraclize(secret, info.json)
	)
	return {
		khaosId: info.json.i,
		result: typeof result === 'string' ? result : undefined,
	}
}

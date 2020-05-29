import { oracleArgInfo } from './../getSecret/getSecret'
import { importOraclize } from '../importOraclize/importOraclize'

export type sendInfo = {
	readonly khaosId: string
	readonly result: string
}

export const executeOraclize = async (
	info: oracleArgInfo
): Promise<sendInfo> => {
	const oraclize = await importOraclize(info.json.i)
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const oraclizeResult = await oraclize(info.secret.resource!.secret, info.json)
	const result: sendInfo = {
		khaosId: info.json.i,
		result: oraclizeResult.toString(),
	}
	return result
}

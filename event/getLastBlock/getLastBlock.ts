import { reader } from '../db/db'
import { CosmosClient } from '@azure/cosmos'

export const getLastBlock = async (id: string): Promise<number> => {
	const record = await reader(CosmosClient)(id)
	// eslint-disable-next-line functional/no-conditional-statement
	if (record instanceof Error || record.statusCode !== 200) {
		// eslint-disable-next-line functional/no-throw-statement
		throw new Error('hogehoge')
	}
	// TODO レコードが存在しない時は0を返すようにする
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return record.resource?.lastBlock!
}

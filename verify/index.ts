import { reader } from '../sign/db/db'
import { CosmosClient } from '@azure/cosmos'
import { verify as _verify } from 'jsonwebtoken'
import { tryCatch, F } from 'ramda'

export const verify = async (id: string, account: string): Promise<boolean> => {
	const savedSecret = await reader(CosmosClient)(id).catch((err: Error) => err)
	return savedSecret instanceof Error || savedSecret.statusCode !== 200
		? false
		: tryCatch((i: string, a: string) => Boolean(_verify(i, a)), F)(id, account)
}

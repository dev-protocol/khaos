import { sign } from 'jsonwebtoken'

export const publicSignature = (
	message: string,
	account: string,
	key: string
): string => sign(`%${message}%-%${account}%`, key)

import { sign } from 'jsonwebtoken'

export const publicSignature = (
	message: string,
	id: string,
	account: string
): string => sign(`%${message}%-%${id}%`, account)

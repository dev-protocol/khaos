import { sign } from 'jsonwebtoken'

export type PublicSignatureOptions = {
	readonly message: string
	readonly id: string
	readonly account: string
}

export const publicSignature = ({
	message,
	id,
	account,
}: PublicSignatureOptions): string => sign(`%${message}%-%${id}%`, account)

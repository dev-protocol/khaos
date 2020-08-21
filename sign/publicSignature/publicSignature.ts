import { sign } from 'jsonwebtoken'

export type PublicSignatureOptions = {
	readonly message: string
	readonly id: string
	readonly address: string
}

export const publicSignature = ({
	message,
	id,
	address,
}: PublicSignatureOptions): string => sign(`%${message}%-%${id}%`, address)

import { sign } from 'jsonwebtoken'

export type PublicSignatureOptions = {
	readonly message: string
	readonly id: string
	readonly address: string
}

export const publicSignature = ({
	id: i,
	message: m,
	address,
}: PublicSignatureOptions): string => sign(JSON.stringify({ i, m }), address)

import { verify } from 'jsonwebtoken'
import { tryCatch, always } from 'ramda'
import { PublicSignatureOptions } from './publicSignature'

export const recoverPublicSignature = (
	publicSignature: string,
	address: string
): PublicSignatureOptions | undefined =>
	tryCatch<PublicSignatureOptions | undefined>(
		(i: string, a: string) =>
			(({ i: id, m: message, a: address }) => ({
				id,
				message,
				address,
			}))(
				verify(i, a) as {
					readonly i: string
					readonly m: string
					readonly a: string
				}
			),
		always(undefined)
	)(publicSignature, address)

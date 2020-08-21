import { verify } from 'jsonwebtoken'
import { tryCatch, always } from 'ramda'
import { when } from '../../common/util/when'
import { PublicSignatureOptions } from './publicSignature'

export const recoverPublicSignature = (
	publicSignature: string,
	address: string
): PublicSignatureOptions | undefined => {
	const recover = tryCatch(
		(i: string, a: string) => verify(i, a),
		always(undefined)
	)(publicSignature, address)
	const parsed = when(recover, (rec) =>
		typeof rec === 'string'
			? rec.replace(/(^%|%$)/g, '').split('%-%')
			: undefined
	)
	return when(parsed, ([message, id]) => ({ message, id, address }))
}

import Web3 from 'web3'
import { tryCatch, always } from 'ramda'

export const recover = (
	message: string,
	signature: string
): string | undefined => {
	return tryCatch(
		(m, s) => new Web3().eth.accounts.recover(m, s),
		always(undefined)
	)(message, signature)
}

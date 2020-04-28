import Web3 from 'web3'

export const recover = (message: string, signature: string): string => {
	return new Web3().eth.accounts.recover(message, signature)
}

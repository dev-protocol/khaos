import { Result } from '@ethersproject/abi'

export type MarketQueryData = {
	readonly publicSignature: string
	readonly allData: Result
	readonly transactionhash: string
}

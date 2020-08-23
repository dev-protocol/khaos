import { PublicSignatureOptions } from '../sign/publicSignature/publicSignature'
import { MarketQueryData } from '../oracle/getData/getData'

export type KhaosCallbackArg = {
	readonly message: string
	readonly status: number
	readonly statusMessage: string
}

export type Oraclize = (
	signedOptions: PublicSignatureOptions,
	queryData: MarketQueryData
) => Promise<KhaosCallbackArg>

import { PublicSignatureOptions } from '../sign/publicSignature/publicSignature'
import { MarketQueryData } from '../common/structs'
import { NetworkName } from '../common/types'

export type KhaosCallbackArg = {
	readonly message: string
	readonly status: number
	readonly statusMessage: string
}

export type Oraclize = (
	signedOptions: PublicSignatureOptions,
	queryData: MarketQueryData,
	net: NetworkName
) => Promise<KhaosCallbackArg>

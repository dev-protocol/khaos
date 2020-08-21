import { KhaosEventData } from './../oracle/getData/getData'
import { PublicSignatureOptions } from '../sign/publicSignature/publicSignature'

export type Oraclize = (
	signedOptions: PublicSignatureOptions,
	data: KhaosEventData
) => Promise<string>

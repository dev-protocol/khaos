export type Oraclize = (
	secret: string,
	account: string,
	publicSignature: string
) => Promise<string>

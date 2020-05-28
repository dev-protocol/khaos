export type Oraclize = (
	secret: string,
	data: ReadonlyMap<string, string>
) => Promise<string>

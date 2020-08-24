export const withPartitionKey = <T>(
	data: T,
	key: string
): T & {
	readonly _partitionKey: string
} => ({ ...data, ...{ _partitionKey: key } })

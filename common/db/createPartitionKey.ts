export const createPartitionKey = (
	paths?: readonly string[]
): { readonly paths: readonly string[] } => ({
	paths: paths ? [...paths] : ['/partition'],
})

export const createPartitionKey = (
	paths: readonly string[] = ['/partition']
): { readonly paths: readonly string[] } => ({
	paths: [...paths],
})

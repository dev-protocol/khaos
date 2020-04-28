import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { always, F } from 'ramda'

export type SignResult = {
	readonly message: string
	readonly secret: string
}

export type SignFunction = (
	context: Context,
	req: HttpRequest
) => Promise<SignResult>

const sign: AzureFunction = async (
	context: Context,
	req: HttpRequest
): Promise<void> => {
	const id = req.params.id
	const fn = await import(`../functions/sign/${id}`)
		.then((fn: SignFunction) => fn)
		.catch(always(F))
	const result = await fn(context, req)
	const publicSignature = Math.random().toString()

	// eslint-disable-next-line functional/immutable-data, functional/no-expression-statement
	context.res = {
		status: result ? 200 : 400,
		body: publicSignature,
	}
}

export default sign

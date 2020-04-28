import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { always, F } from 'ramda'
import { recover } from './recover'

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
	const { message, signature } = req.body
	const fn = await import(`../functions/sign/${id}`)
		.then((e: { readonly default: SignFunction }) => e.default)
		.catch(always(F))
	const result = await fn(context, req)
	const account = recover(message, signature)
	const publicSignature = `${account}${Math.random().toString()}`

	// eslint-disable-next-line functional/immutable-data, functional/no-expression-statement
	context.res = {
		status: result ? 200 : 400,
		body: publicSignature,
	}
}

export default sign

import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { always, F } from 'ramda'

export type AuthResult = {
	readonly message: string
	readonly secret: string
}

export type AuthFunction = (
	context: Context,
	req: HttpRequest
) => Promise<AuthResult>

const httpTrigger: AzureFunction = async (
	context: Context,
	req: HttpRequest
): Promise<void> => {
	const id = req.params.id
	const fn = await import(`../functions/auth/${id}`)
		.then((fn: AuthFunction) => fn)
		.catch(always(F))
	const result = await fn(context, req)
	const publicSignature = Math.random().toString()

	// eslint-disable-next-line functional/immutable-data, functional/no-expression-statement
	context.res = {
		status: result ? 200 : 400,
		body: publicSignature,
	}
}

export default httpTrigger

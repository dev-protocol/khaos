import { AzureFunction, Context, HttpRequest } from '@azure/functions'

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
	const fn: AuthFunction | Error = await import(
		`../functions/auth/${id}`
	).catch((err: Error) => err)
	const result = await (fn instanceof Error ? undefined : fn(context, req))
	const publicSignature = Math.random().toString()

	// eslint-disable-next-line functional/immutable-data, functional/no-expression-statement
	context.res = {
		status: result === undefined ? 400 : 200,
		body: publicSignature,
	}
}

export default httpTrigger

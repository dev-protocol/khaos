import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { always, F } from 'ramda'
import { recover } from './recover'
import { publicSignature as pubSig } from './publicSignature'

export type Authorizer = (props: {
	readonly message: string
	readonly secret: string
	readonly req: HttpRequest
}) => Promise<boolean>

const sign: AzureFunction = async (
	context: Context,
	req: HttpRequest
): Promise<void> => {
	const { id = '' } = req.params
	const { message = '', secret = '', signature = '' } = req.body
	const fn = await import(`../functions/authorizer/${id}`)
		.then((e: { readonly default: Authorizer }) => e.default)
		.catch(always(F))
	const result = await fn({ message, secret, req })
	const account = recover(message, signature)
	const publicSignature = account ? pubSig(message, account, id) : undefined

	// eslint-disable-next-line functional/immutable-data, functional/no-expression-statement
	context.res = {
		status: result ? 200 : 400,
		body: {
			account,
			publicSignature,
		},
	}
}

export default sign

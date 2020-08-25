import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { recover } from './recover/recover'
import { publicSignature as pubSig } from './publicSignature/publicSignature'
import { writer } from './../common/db/secret'
import { CosmosClient } from '@azure/cosmos'
import { importAuthorizer } from './importAuthorizer/importAuthorizer'

type Response = {
	readonly status: number
	readonly body: string | Record<string, unknown>
	readonly headers?: {
		readonly [key: string]: string
	}
}

const sign: AzureFunction = async (
	context: Context,
	req: HttpRequest
): Promise<Response> => {
	const { id = '' } = req.params
	const { message = '', secret = '', signature = '' } = req.body
	const fn = await importAuthorizer(id)
	const auth = await fn({ message, secret, req })
	const address = auth ? recover(message, signature) : undefined
	const publicSignature = address ? pubSig({ message, id, address }) : undefined
	const wrote = await (auth && publicSignature && address
		? writer(CosmosClient)({ id: publicSignature, secret, address })
		: undefined)
	const status = auth && wrote?.statusCode === 200 ? 200 : auth ? 500 : 400

	return {
		status,
		body: {
			address,
			publicSignature,
		},
	}
}

export default sign

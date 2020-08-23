import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { recover } from './recover/recover'
import { publicSignature as pubSig } from './publicSignature/publicSignature'
import { writer } from './../common/db/secret'
import { CosmosClient } from '@azure/cosmos'
import { importAuthorizer } from './importAuthorizer/importAuthorizer'

const sign: AzureFunction = async (
	context: Context,
	req: HttpRequest
): Promise<void> => {
	const { id = '' } = req.params
	const { message = '', secret = '', signature = '' } = req.body
	const fn = await importAuthorizer(id)
	const auth = await fn({ message, secret, req })
	const address = recover(message, signature)
	const publicSignature = address ? pubSig({ message, id, address }) : undefined
	const wrote = await (auth && publicSignature && address
		? writer(CosmosClient)({ id: publicSignature, secret, address })
		: undefined)
	const status = auth && wrote?.statusCode === 200 ? 200 : auth ? 500 : 400

	// eslint-disable-next-line functional/immutable-data, functional/no-expression-statement
	context.res = {
		status,
		body: {
			address,
			publicSignature,
		},
	}
}

export default sign

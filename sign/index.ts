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
	const account = recover(message, signature)
	const publicSignature = account ? pubSig({ message, id, account }) : undefined
	const wrote = await (auth && publicSignature
		? writer(CosmosClient)({ id: publicSignature, secret })
		: undefined)
	const status = auth && wrote?.statusCode === 200 ? 200 : auth ? 500 : 400

	// eslint-disable-next-line functional/immutable-data, functional/no-expression-statement
	context.res = {
		status,
		body: {
			account,
			publicSignature,
		},
	}
}

export default sign

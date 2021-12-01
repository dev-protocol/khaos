/* eslint-disable functional/no-expression-statement */
import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { recover } from './recover/recover'
import { publicSignature as pubSig } from '@devprotocol/khaos-core'
import { writer } from './../common/db/secret'
import { CosmosClient } from '@azure/cosmos'
import { call } from '@devprotocol/khaos-functions'

type Response = {
	readonly status: number
	readonly body: string | Record<string, unknown>
	readonly headers?: {
		readonly [key: string]: string
	}
}

const sign: AzureFunction = async (
	context: Context,
	request: HttpRequest
): Promise<Response> => {
	const { id = '' } = request.params
	context.log.info(`id:${id}`)
	const { message = '', secret = '', signature = '' } = request.body
	context.log.info(`message:${message}`)
	context.log.info(`secret:${secret}`)
	context.log.info(`signature:${signature}`)
	const auth = await call()({
		id,
		method: 'authorize',
		options: { message, secret, request },
	})
	context.log.info(`authorize result:${auth?.data}`)
	const address = auth && auth.data ? recover(message, signature) : undefined
	context.log.info(`address:${address}`)
	const publicSignature = address ? pubSig({ message, id, address }) : undefined
	context.log.info(`publicSignature:${publicSignature}`)
	const wrote = await (auth && publicSignature && address
		? writer(CosmosClient)({ id: publicSignature, secret, address })
		: undefined)
	const status =
		auth && auth.data && [200, 201].includes(Number(wrote?.statusCode))
			? 200
			: auth?.data
			? 500
			: 400
	context.log.info(`status:${status}`)
	return {
		status,
		body: {
			address,
			publicSignature,
		},
	}
}

export default sign

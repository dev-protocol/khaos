/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statement */
import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import {idProcessTest} from './idProcessTest'

const httpTrigger: AzureFunction = async function (
	context: Context,
	req: HttpRequest
): Promise<void> {
	const sBlock = req.body.startBlock
	const eBlock = req.body.endBlock
	const network = req.body.network
	const id = req.body.id
	await idProcessTest(context, network)(id, sBlock, eBlock)

	context.res = {
		status: 0,
		body: '',
		headers: {
			'Cache-Control': 'no-store',
		},
	}
}

export default httpTrigger

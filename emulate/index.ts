import { AzureFunction, HttpRequest } from '@azure/functions'
import { whenDefined } from '@devprotocol/util-ts'
import { always } from 'ramda'
import { compute } from '../oracle/compute/compute'

type Response = {
	readonly status: number
	readonly body: string | Record<string, unknown>
	readonly headers?: {
		readonly [key: string]: string
	}
}

const emulate: AzureFunction = async (
	_,
	request: HttpRequest
): Promise<Response> => {
	const { id = '' } = request.params
	const { network = '', event } = request.body
	const computed = await compute(id, network)(event).catch(always(undefined))
	const status = computed ? 200 : 400
	const body = whenDefined(computed, (x) => x.packed) || { data: undefined }

	return {
		status,
		body,
	}
}

export default emulate

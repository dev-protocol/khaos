import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { whenDefined, whenDefinedAll } from '@devprotocol/util-ts'
import { always } from 'ramda'
import { compute } from '../oracle/compute/compute'
import { createContract } from '../oracle/createContract/createContract'
import { estimateTransaction } from '../oracle/estimateTransaction/estimateTransaction'

type Response = {
	readonly status: number
	readonly body: string | Record<string, unknown>
	readonly headers?: {
		readonly [key: string]: string
	}
}

const emulate: AzureFunction = async (
	context: Context,
	request: HttpRequest
): Promise<Response> => {
	const { id = '' } = request.params
	const { network = '', event } = request.body
	const undef = always(undefined)
	const [computed, contract] = await Promise.all([
		compute(id, network)(event).catch(undef),
		createContract(id, network).catch(undef),
	])
	const estimated = await whenDefinedAll(
		[computed?.packed?.data, contract?.[0]],
		([packed, contractInterface]) =>
			estimateTransaction(contractInterface)(packed.name, packed.args).catch(
				undef
			)
	)
	const gasLimit = whenDefined(estimated, (e) => e.toString())
	const status = computed ? 200 : 400

	const body = whenDefined(computed?.packed?.data, (packed) => ({
		data: { ...packed, gasLimit },
	})) || { data: undefined }

	// eslint-disable-next-line functional/no-expression-statement
	context.log.info({body, computed, estimated})

	return {
		status,
		body,
	}
}

export default emulate

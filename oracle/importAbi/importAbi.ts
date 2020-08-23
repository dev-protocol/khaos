import { always } from 'ramda'
import { Abi } from '../../functions/abi'

export const importAbi = async (id: string): Promise<Abi | (() => undefined)> =>
	import(`../../functions/${id}/abi`)
		.then((e: { readonly default: Abi }) => e.default)
		.catch(always(always(undefined)))

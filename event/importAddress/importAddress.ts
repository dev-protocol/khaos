import { always } from 'ramda'
import { Address } from '../../functions/address'

export const importAddress = async (
	id: string
): Promise<Address | (() => undefined)> =>
	import(`../../functions/${id}/address`)
		.then((e: { readonly default: Address }) => e.default)
		.catch(always(always(undefined)))

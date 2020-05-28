import { always, F } from 'ramda'
import { Address } from '../../functions/address'

export const importAddress = async (
	id: string
): Promise<Address | (() => boolean)> =>
	import(`../../functions/${id}/address`)
		.then((e: { readonly default: Address }) => e.default)
		.catch(always(F))

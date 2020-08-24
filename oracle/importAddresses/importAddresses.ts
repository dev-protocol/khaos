import { always } from 'ramda'
import { Addresses } from '../../functions/addresses'

export const importAddresses = async (
	id: string
): Promise<Addresses | (() => undefined)> =>
	import(`../../functions/${id}/addresses`)
		.then((e: { readonly default: Addresses }) => e.default)
		.catch(always(always(undefined)))

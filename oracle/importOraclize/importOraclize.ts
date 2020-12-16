import { always } from 'ramda'
import { Oraclizer } from '../../functions/oraclizer'

export const importOraclize = async (
	id: string
): Promise<Oraclizer | (() => undefined)> =>
	import(`../../functions/${id}/oraclize`)
		.then((e: { readonly default: Oraclizer }) => e.default)
		.catch(always(always(undefined)))

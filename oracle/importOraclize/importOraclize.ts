import { always } from 'ramda'
import { Oraclize } from '../../functions/oraclize'

export const importOraclize = async (
	id: string
): Promise<Oraclize | (() => undefined)> =>
	import(`../../functions/${id}/oraclize`)
		.then((e: { readonly default: Oraclize }) => e.default)
		.catch(always(always(undefined)))
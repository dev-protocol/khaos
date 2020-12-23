import { always, F } from 'ramda'
import { Authorizer } from '../../functions/authorizer'

export const importAuthorizer = async (
	id: string
): Promise<Authorizer | (() => boolean)> =>
	import(`../../functions/${id}/authorize`)
		.then((e: { readonly default: Authorizer }) => e.default)
		.catch(always(F))

import { always, F } from 'ramda'
import { Authorizer } from '../../functions/authorizer/authorizer'

export const importAuthorizer = async (
	id: string
): Promise<Authorizer | (() => boolean)> =>
	import(`../functions/authorizer/${id}`)
		.then((e: { readonly default: Authorizer }) => e.default)
		.catch(always(F))

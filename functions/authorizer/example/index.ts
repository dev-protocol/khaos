import { Authorizer } from '../../../sign'

const fn: Authorizer = async ({ message, secret }) => {
	return [message, secret].every((x) => typeof x === 'string')
}

export default fn

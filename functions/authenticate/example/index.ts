import { Authenticator } from '../../../sign'

const fn: Authenticator = async ({ message, secret }) => {
	return [message, secret].every((x) => typeof x === 'string')
}

export default fn

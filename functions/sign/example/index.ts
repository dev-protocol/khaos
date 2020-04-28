import { SignFunction } from '../../../sign'

const fn: SignFunction = async ({ message, secret }) => {
	return [message, secret].every((x) => typeof x === 'string')
}

export default fn

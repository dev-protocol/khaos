import { HttpRequest } from '@azure/functions'
import { SignFunction } from '../../../sign'

const fn: SignFunction = async (_, req: HttpRequest) => {
	return {
		message: req.params.message,
		secret: req.params.secret,
	}
}

export default fn

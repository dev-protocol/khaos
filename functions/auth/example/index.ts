import { HttpRequest } from '@azure/functions'
import { AuthFunction } from '../../../auth'

const fn: AuthFunction = async (_, req: HttpRequest) => {
	return {
		message: req.params.message,
		secret: req.params.secret,
	}
}

export = fn

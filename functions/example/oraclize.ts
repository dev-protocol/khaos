import { Oraclize } from '../oraclize'

const fn: Oraclize = async (opts, eventData) => {
	return {
		message: opts.message,
		status: 0,
		statusMessage: `With ${eventData.publicSignature}`,
	}
}

export default fn

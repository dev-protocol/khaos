import { Oraclize } from '../oraclize'

const fn: Oraclize = async (opts, eventData, net) => {
	return {
		message: opts.message,
		status: 0,
		statusMessage: `${net} ${eventData.publicSignature}`,
	}
}

export default fn

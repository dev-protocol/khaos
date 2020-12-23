import { Oraclizer } from '../oraclizer'

const fn: Oraclizer = async ({ signatureOptions, query, network }) => {
	return {
		message: signatureOptions.message,
		status: 0,
		statusMessage: `${network} ${query.publicSignature}`,
	}
}

export default fn

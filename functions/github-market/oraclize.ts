import { Oraclize, KhaosCallbackArg } from '../oraclize'

const fn: Oraclize = async (opts, queryData) => {
	const test = queryData.allData.githubRepository == opts.message
	return test
		? ({
				message: opts.message,
				status: 0,
				statusMessage: 'success',
		  } as KhaosCallbackArg)
		: ({
				message: opts.message,
				status: 2,
				statusMessage: 'error',
		  } as KhaosCallbackArg)
}

export default fn

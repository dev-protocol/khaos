import { Oraclize, KhaosCallbackArg } from '../oraclize'

const fn: Oraclize = async (opts, queryData, net) => {
	const incubatorAddress =
		net === 'mainnet' ? 'incubator address' : 'ropsten incubator address'

	const test1 = queryData.allData['githubRepository'] === opts.message
	const test2 =
		queryData.allData['account'] === incubatorAddress
			? true
			: queryData.allData['account'] === opts.address

	return test1 && test2
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

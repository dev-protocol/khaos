import { Oraclizer, KhaosCallbackArg } from '../oraclizer'

const fn: Oraclizer = async (opts, queryData, net) => {
	const incubatorAddress =
		net === 'mainnet'
			? '0x0000000000000000000000000000000000000000'
			: '0xCBffAD9738B627Fb9eE3fef691518AAdB98Bc86f'

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

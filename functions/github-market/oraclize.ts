import { Oraclizer, KhaosCallbackArg } from '../oraclizer'

const fn: Oraclizer = async ({ signatureOptions, query, network }) => {
	const incubatorAddress =
		network === 'mainnet'
			? '0x0000000000000000000000000000000000000000'
			: '0xCBffAD9738B627Fb9eE3fef691518AAdB98Bc86f'

	const test1 = query.allData['githubRepository'] === signatureOptions.message
	const test2 =
		query.allData['account'] === incubatorAddress
			? true
			: query.allData['account'] === signatureOptions.address

	return test1 && test2
		? ({
				message: signatureOptions.message,
				status: 0,
				statusMessage: 'success',
		  } as KhaosCallbackArg)
		: ({
				message: signatureOptions.message,
				status: 2,
				statusMessage: 'error',
		  } as KhaosCallbackArg)
}

export default fn

import { Oraclize, KhaosCallbackArg } from '../oraclize'
import Web3 from 'web3'
import { ethers } from 'ethers'
import bent from 'bent'
import { tryCatch, always } from 'ramda'
import { when } from '../../common/util/when'
import { MarketQueryData } from '../../oracle/getData/getData'

// export type QueryAdditionalDataData = {
// 	readonly repository: string
// 	readonly property: string
// }

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

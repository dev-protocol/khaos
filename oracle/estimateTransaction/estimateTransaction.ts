import { FunctionPackResults } from '@devprotocol/khaos-core'
import { UndefinedOr, whenDefinedAll } from '@devprotocol/util-ts'
import { BigNumberish, ethers } from 'ethers'
import { always } from 'ramda'

export const estimateTransaction = (contract: ethers.Contract) => async (
	name: string,
	args: FunctionPackResults['args']
): Promise<UndefinedOr<BigNumberish>> => {
	return whenDefinedAll(
		[contract.estimateGas[name], args],
		([callback, _args]) => callback(..._args).catch(always(undefined))
	)
}

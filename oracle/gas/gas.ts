/* eslint-disable functional/functional-parameters */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import bent from 'bent'
import Web3 from 'web3'

type EGSResponse = {
	readonly fast: number
	readonly fastest: number
	readonly safeLow: number
	readonly average: number
	readonly block_time: number
	readonly blockNum: number
	readonly speed: number
	readonly safeLowWait: number
	readonly avgWait: number
	readonly fastWait: number
	readonly fastestWait: number
}

const createEGSFetcher = (
	fetcher: bent.RequestFunction<bent.ValidResponse>
) => async (): Promise<EGSResponse> =>
	fetcher('').then((r) => (r as unknown) as EGSResponse)

export const createFastestGasPriceFetcher = (
	fetcher: bent.RequestFunction<bent.ValidResponse>,
	libWeb3: Web3
) =>
	((egs) => async () =>
		// TODO replace ethers...
		egs().then((res) => libWeb3.utils.toWei(`${res.fastest / 10}`, 'Gwei')))(
		createEGSFetcher(fetcher)
	)

export const ethgas = (token: string) =>
	bent(`https://ethgasstation.info/api/ethgasAPI.json?api-key=${token}`, 'json')

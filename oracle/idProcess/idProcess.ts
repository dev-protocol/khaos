/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Context } from '@azure/functions'
import { importAbi } from '../importAbi/importAbi'
import { getLastBlock } from '../getLastBlock/getLastBlock'
import { getEvents } from '../getEvents/getEvents'
import { getData } from '../getData/getData'
import { getSecret } from '../getSecret/getSecret'
import { getToBlockNumber } from '../getToBlockNumber/getToBlockNumber'
import { executeOraclize, sendInfo } from '../executeOraclize/executeOraclize'
import { sendContractMethod } from '../sendContractMethod/sendContractMethod'
import { whenDefined } from '../../common/util/whenDefined'
import { writer, LastBlock } from '../db/last-block'
import { CosmosClient } from '@azure/cosmos'
import { ethers } from 'ethers'
import { importAddresses } from '../importAddresses/importAddresses'
import { NetworkName } from '../../functions/addresses'
import { tryCatch, always } from 'ramda'

export type Results = {
	readonly sent: boolean
	readonly address: string
	readonly results: readonly sendInfo[]
	readonly state?: readonly any[]
}

export const idProcess = (context: Context, network: NetworkName) => async (
	id: string
): Promise<readonly Results[] | undefined> => {
	const addresses = await importAddresses(id)
	const provider = whenDefined(process.env.KHAOS_INFURA_ID, (infura) =>
		ethers.getDefaultProvider(network, {
			infura,
		})
	)
	const toBlockNumber = await whenDefined(provider, (prov) =>
		getToBlockNumber(prov)
	)
	const abi = await importAbi(id)
	const wallet = whenDefined(provider, (prov) =>
		whenDefined(process.env.KHAOS_MNEMONIC, (mnemonic) =>
			ethers.Wallet.fromMnemonic(mnemonic).connect(prov)
		)
	)
	const address = await addresses(network)
	const marketBehavior = await whenDefined(address, (adr) =>
		whenDefined(
			abi,
			tryCatch(
				(intf) =>
					((c) => c.resolvedAddress.then(always(c)).catch(always(undefined)))(
						new ethers.Contract(adr, intf, wallet)
					),
				always(undefined)
			)
		)
	)

	const fromBlock = await whenDefined(address, (adr) => getLastBlock(adr))
	const events = await whenDefined(fromBlock, (from) =>
		whenDefined(toBlockNumber, (to) =>
			whenDefined(marketBehavior, (behavior) =>
				getEvents(behavior, from + 1, to)
			)
		)
	)
	// eslint-disable-next-line functional/no-expression-statement
	context.log.info(`block from:${(fromBlock || 0) + 1} to ${toBlockNumber}`)

	const state = whenDefined(events, (x) => x.map(getData))
	const oracleArgList = await whenDefined(state, (x) =>
		Promise.all(x.map(getSecret))
	)
	const results = await whenDefined(oracleArgList, (x) =>
		Promise.all(x.map(executeOraclize(id)))
	)
	const writerInfo: LastBlock | undefined = whenDefined(address, (adr) =>
		whenDefined(toBlockNumber, (block) => ({
			id: adr,
			lastBlock: block,
		}))
	)
	// eslint-disable-next-line functional/no-expression-statement
	await whenDefined(writerInfo, (data) => writer(CosmosClient)(data))
	return whenDefined(address, (x) =>
		whenDefined(results, (y) =>
			whenDefined(marketBehavior, (z) =>
				Promise.all(
					y.map((i) => sendContractMethod(z)(i).catch(always(undefined)))
				).then((res) =>
					res.map((sent) => ({
						address: x,
						results: y,
						sent: Boolean(sent),
						state,
					}))
				)
			)
		)
	)
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Context } from '@azure/functions'
import { importAbi } from '../importAbi/importAbi'
import { getLastBlock } from '../getLastBlock/getLastBlock'
import { getEvents } from '../getEvents/getEvents'
import { getData } from '../getData/getData'
import { getSecret } from '../getSecret/getSecret'
import { executeOraclize, sendInfo } from '../executeOraclize/executeOraclize'
import { sendContractMethod } from '../sendContractMethod/sendContractMethod'
import { when } from '../../common/util/when'
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
	const provider = ethers.getDefaultProvider(network, {
		infura: process.env.KHAOS_INFURA_ID,
	})
	const currentBlockNumber = await provider.getBlockNumber()
	const abi = await importAbi(id)
	const wallet = ethers.Wallet.fromMnemonic(
		process.env.KHAOS_MNEMONIC!
	).connect(provider)
	const address = await addresses(network)
	const marketBehavior = when(address, (adr) =>
		when(
			abi,
			tryCatch(
				(intf) => new ethers.Contract(adr, intf, wallet),
				always(undefined)
			)
		)
	)

	const lastBlock = await getLastBlock(id)
	// eslint-disable-next-line functional/no-expression-statement
	context.log.info(`block from:${lastBlock + 1} to ${currentBlockNumber}`)
	const events = await when(marketBehavior, (behavior) =>
		getEvents(behavior, lastBlock + 1, currentBlockNumber)
	)
	const state = when(events, (x) => x.map(getData))
	const oracleArgList = await when(state, (x) => Promise.all(x.map(getSecret)))
	const results = await when(oracleArgList, (x) =>
		Promise.all(x.map(executeOraclize(id)))
	)
	const writerInfo: LastBlock = {
		id: address!,
		lastBlock: currentBlockNumber,
	}
	// eslint-disable-next-line functional/no-expression-statement
	await writer(CosmosClient)(writerInfo)
	return when(address, (x) =>
		when(results, (y) =>
			when(marketBehavior, (z) =>
				Promise.all(y.map(sendContractMethod(z))).then((res) =>
					res.map((sent) => ({
						address: x,
						results: y,
						sent,
						state,
					}))
				)
			)
		)
	)
}

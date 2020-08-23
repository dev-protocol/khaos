import { importAddress } from '../importAddress/importAddress'
import { importAbi } from '../importAbi/importAbi'
import { getLastBlock } from '../getLastBlock/getLastBlock'
import { getEvents } from '../getEvents/getEvents'
import { getData } from '../getData/getData'
import { getSecret } from '../getSecret/getSecret'
import { executeOraclize, sendInfo } from '../executeOraclize/executeOraclize'
import { sendContractMethod } from '../sendContractMethod/sendContractMethod'
import { when } from '../../common/util/when'
import { writer, LastBlock } from '../db/db'
import { CosmosClient } from '@azure/cosmos'
import { ethers } from 'ethers'

export type Results = {
	readonly sent: boolean
	readonly address: string
	readonly results: readonly sendInfo[]
	readonly state?: readonly any[]
}

export const idProcess = (network: string) => async (
	id: string
): Promise<readonly Results[] | undefined> => {
	const fn = await importAddress(id)
	const address = fn(network)
	const provider = ethers.getDefaultProvider(network, {
		infura: process.env.INFURA_ID,
	})
	const currentBlockNumber = provider.blockNumber
	const fnAbi = await importAbi(id)
	const abi = fnAbi()
	const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC!).connect(
		provider
	)
	const marketBehavior = new ethers.Contract(address!, abi!, wallet)

	const lastBlock = await getLastBlock(id)
	const events = await getEvents(
		marketBehavior,
		lastBlock + 1,
		currentBlockNumber
	)
	const state = when(events, (x) => x.map(getData))
	const oracleArgList = await when(state, (x) => Promise.all(x.map(getSecret)))
	const results = await when(oracleArgList, (x) =>
		Promise.all(x.map(executeOraclize(id)))
	)
	const writerInfo: LastBlock = {
		address: address!,
		lastBlock: currentBlockNumber,
	}
	// eslint-disable-next-line functional/no-expression-statement
	await writer(CosmosClient)(writerInfo)
	return when(address, (x) =>
		when(results, (y) =>
			Promise.all(y.map(sendContractMethod(marketBehavior))).then((res) =>
				res.map((sent) => ({
					address: x,
					results: y,
					sent,
					state,
				}))
			)
		)
	)
}

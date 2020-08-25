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
	const provider = when(process.env.KHAOS_INFURA_ID, (infura) =>
		ethers.getDefaultProvider(network, {
			infura,
		})
	)
	const currentBlockNumber = await when(provider, (prov) =>
		prov.getBlockNumber()
	)
	const abi = await importAbi(id)
	const wallet = when(provider, (prov) =>
		when(process.env.KHAOS_MNEMONIC, (mnemonic) =>
			ethers.Wallet.fromMnemonic(mnemonic).connect(prov)
		)
	)
	const address = await addresses(network)
	const marketBehavior = await when(address, (adr) =>
		when(
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

	const lastBlock = await when(address, (adr) => getLastBlock(adr))
	const events = await when(lastBlock, (last) =>
		when(currentBlockNumber, (block) =>
			when(marketBehavior, (behavior) => getEvents(behavior, last + 1, block))
		)
	)
	// eslint-disable-next-line functional/no-expression-statement
	context.log.info(
		`block from:${(lastBlock || 0) + 1} to ${currentBlockNumber}`
	)

	const state = when(events, (x) => x.map(getData))
	const oracleArgList = await when(state, (x) => Promise.all(x.map(getSecret)))
	const results = await when(oracleArgList, (x) =>
		Promise.all(x.map(executeOraclize(id)))
	)
	const writerInfo: LastBlock | undefined = when(address, (adr) =>
		when(currentBlockNumber, (block) => ({
			id: adr,
			lastBlock: block,
		}))
	)
	// eslint-disable-next-line functional/no-expression-statement
	await when(writerInfo, (data) => writer(CosmosClient)(data))
	return when(address, (x) =>
		when(results, (y) =>
			when(marketBehavior, (z) =>
				Promise.all(y.map(sendContractMethod(z))).then((res) =>
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

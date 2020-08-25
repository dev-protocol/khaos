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

export const idProcess = (network: NetworkName) => async (
	id: string
): Promise<readonly Results[] | undefined> => {
	const addresses = await importAddresses(id)
	const provider = when(process.env.KHAOS_INFURA_ID, (infura) =>
		ethers.getDefaultProvider(network, {
			infura,
		})
	)
	const currentBlockNumber = when(provider, (prov) => prov.blockNumber)
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

	const lastBlock = await getLastBlock(id)
	const events = await when(currentBlockNumber, (block) =>
		when(marketBehavior, (behavior) =>
			getEvents(behavior, lastBlock + 1, block)
		)
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
						sent,
						state,
					}))
				)
			)
		)
	)
}

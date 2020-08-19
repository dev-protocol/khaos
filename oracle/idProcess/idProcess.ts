import { importAddress } from '../importAddress/importAddress'
import { getLastBlock } from '../getLastBlock/getLastBlock'
import { getEvents } from '../getEvents/getEvents'
import { getData } from '../getData/getData'
import { getSecret } from '../getSecret/getSecret'
import { executeOraclize, sendInfo } from '../executeOraclize/executeOraclize'
import { sendContractMethod } from '../sendContractMethod/sendContractMethod'
import { when } from '../../common/util/when'
import Web3 from 'web3'
import { NetworkName } from '../../functions/address'

export type Results = {
	readonly sent: boolean
	readonly address: string
	readonly results: readonly sendInfo[]
	readonly state?: readonly any[]
}

export const idProcess = (web3: Web3, network: NetworkName) => async (
	id: string
): Promise<readonly Results[] | undefined> => {
	const currentBlockNumber = await web3.eth.getBlockNumber()
	const fn = await importAddress(id)
	const address = fn(network)
	const lastBlock = await getLastBlock(id)
	const events = await when(address, (adr) =>
		getEvents(web3, adr, lastBlock + 1, currentBlockNumber)
	)
	const state = when(events, (x) => x.map(getData))
	const oracleArgList = await when(state, (x) => Promise.all(x.map(getSecret)))
	const results = await when(oracleArgList, (x) =>
		Promise.all(x.map(executeOraclize(id)))
	)
	return when(address, (x) =>
		when(results, (y) =>
			Promise.all(y.map(sendContractMethod(web3, x))).then((res) =>
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

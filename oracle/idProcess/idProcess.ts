/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Context } from '@azure/functions'
import { getFromBlock } from '../getFromBlock/getFromBlock'
import { getEvents } from '../getEvents/getEvents'
import { getData } from '../getData/getData'
import { getSecret } from '../getSecret/getSecret'
import { getToBlockNumber } from '../getToBlockNumber/getToBlockNumber'
import { executeOraclize, sendInfo } from '../executeOraclize/executeOraclize'
import { sendContractMethod } from '../sendContractMethod/sendContractMethod'
import { whenDefined } from '@devprotocol/util-ts'
import { ethers } from 'ethers'
import { NetworkName } from '../../common/types'
import { tryCatch, always } from 'ramda'
import { saveReceivedEventHashe } from '../saveReceivedEventHashe/saveReceivedEventHashe'
import { whenDefinedAll } from '@devprotocol/util-ts'
import { call } from '@devprotocol/khaos-functions'

export type Results = {
	readonly sent: boolean
	readonly address: string
	readonly results: readonly sendInfo[]
	readonly state?: readonly any[]
}

export const idProcess = (context: Context, network: NetworkName) => async (
	id: string
): Promise<readonly Results[] | undefined> => {
	const khaosFunctions = call()
	const address = await khaosFunctions({
		id,
		method: 'addresses',
		options: { network },
	})
	const provider = whenDefined(
		process.env.KHAOS_INFURA_ID,
		(infura) =>
			new ethers.providers.InfuraProvider(
				network === 'mainnet' ? 'homestead' : network,
				infura
			)
	)
	const toBlockNumber = await whenDefined(provider, (prov) =>
		getToBlockNumber(prov)
	)
	const abi = await khaosFunctions({ id, method: 'abi' })
	const wallet = whenDefinedAll(
		[provider, process.env.KHAOS_MNEMONIC],
		([prov, mnemonic]) => ethers.Wallet.fromMnemonic(mnemonic).connect(prov)
	)
	const marketBehavior = await whenDefinedAll(
		[address?.data, abi?.data],
		([adr, i]) =>
			tryCatch(
				(intf) =>
					((c) => c.resolvedAddress.then(always(c)).catch(always(undefined)))(
						new ethers.Contract(adr, intf, wallet)
					),
				always(undefined)
			)(i)
	)

	const fromBlock = getFromBlock(toBlockNumber)
	// eslint-disable-next-line functional/no-expression-statement
	context.log.info(`block from:${fromBlock || 0} to ${toBlockNumber || 0}`)
	const events = await whenDefinedAll(
		[fromBlock, toBlockNumber, marketBehavior],
		([from, to, behavior]) => getEvents(behavior, from, to, id)
	)
	// eslint-disable-next-line functional/no-expression-statement
	context.log.info(`event count:${events?.length}`)
	const state = whenDefined(events, (x) => x.map(getData))
	const oracleArgList = await whenDefined(state, (x) =>
		Promise.all(x.map(getSecret))
	)
	// eslint-disable-next-line functional/no-expression-statement
	await whenDefined(state, (x) =>
		Promise.all(x.map(saveReceivedEventHashe(id)))
	)
	const results = await whenDefined(oracleArgList, (x) =>
		Promise.all(x.map(executeOraclize(id, network)))
	)
	return whenDefinedAll([address?.data, results, marketBehavior], ([x, y, z]) =>
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
}

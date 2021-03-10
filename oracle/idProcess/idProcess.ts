/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Context } from '@azure/functions'
import { getFromBlock } from '../getFromBlock/getFromBlock'
import { getEvents } from '../getEvents/getEvents'
import { getToBlockNumber } from '../getToBlockNumber/getToBlockNumber'
import { sendInfo } from '../executeOraclize/executeOraclize'
import { sendContractMethod } from '../sendContractMethod/sendContractMethod'
import { whenDefined } from '@devprotocol/util-ts'
import { ethers } from 'ethers'
import { NetworkName } from '../../common/types'
import { tryCatch, always } from 'ramda'
import { saveReceivedEventHashe } from '../saveReceivedEventHashe/saveReceivedEventHashe'
import { whenDefinedAll } from '@devprotocol/util-ts'
import { call } from '@devprotocol/khaos-functions'
import { compute } from '../compute/compute'

export type Results = {
	readonly sent: boolean
	readonly address: string
	readonly results: readonly sendInfo[]
}

export const idProcess = (context: Context, network: NetworkName) => async (
	id: string
): Promise<readonly Results[] | undefined> => {
	// eslint-disable-next-line functional/no-expression-statement
	context.log.info(`id:${id} network name:${network}`)
	const khaosFunctions = call()
	const address = await khaosFunctions({
		id,
		method: 'addresses',
		options: { network },
	})
	// eslint-disable-next-line functional/no-expression-statement
	context.log.info(`id:${id} contract address:${address?.data}`)
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
	// eslint-disable-next-line functional/no-expression-statement
	context.log.info(`id:${id} abi:${abi?.data}`)
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
	context.log.info(
		`id:${id} block from:${fromBlock || 0} to ${toBlockNumber || 0}`
	)
	const event = await khaosFunctions({
		id,
		method: 'event',
		options: { network },
	})
	const events = await whenDefinedAll(
		[fromBlock, toBlockNumber, marketBehavior, event?.data],
		([from, to, behavior, ev]) => getEvents(behavior, from, to, id, ev)
	)
	// eslint-disable-next-line functional/no-expression-statement
	context.log.info(`id:${id} event count:${events?.length}`)
	const computed = await whenDefined(events, (x) =>
		Promise.all(x.map(compute(id, network)))
	)
	// eslint-disable-next-line functional/no-expression-statement
	await whenDefined(computed, (c) =>
		Promise.all(c.map((c) => c.query).map(saveReceivedEventHashe(id)))
	)
	return whenDefinedAll(
		[address?.data, computed, marketBehavior],
		([contractAddress, computedData, contractInterface]) =>
			Promise.all(
				computedData
					.map((x) => x.packed)
					.map((packed) =>
						whenDefined(packed, ({ data }) =>
							whenDefinedAll([data?.name, data?.args], ([name, args]) =>
								sendContractMethod(contractInterface)(name, args).catch(
									always(undefined)
								)
							)
						)
					)
			).then((res) =>
				res.map((sent) => ({
					address: contractAddress,
					results: computedData.map((x) => x.oraclized),
					sent: Boolean(sent),
				}))
			)
	)
}

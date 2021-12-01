/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Context } from '@azure/functions'
import { getFromBlock } from '../getFromBlock/getFromBlock'
import { getEvents } from '../getEvents/getEvents'
import { getToBlockNumber } from '../getToBlockNumber/getToBlockNumber'
import { sendInfo } from '../executeOraclize/executeOraclize'
import { sendContractMethod } from '../sendContractMethod/sendContractMethod'
import { whenDefined } from '@devprotocol/util-ts'
import { NetworkName } from '../../common/types'
import { always } from 'ramda'
import { saveReceivedEventHashe } from '../saveReceivedEventHashe/saveReceivedEventHashe'
import { whenDefinedAll } from '@devprotocol/util-ts'
import { call } from '@devprotocol/khaos-functions'
import { compute } from '../compute/compute'
import { createContract } from '../createContract/createContract'

export type Results = {
	readonly sent: boolean
	readonly address: string
	readonly results: readonly sendInfo[]
}

export const idProcess =
	(context: Context, network: NetworkName) =>
	async (id: string): Promise<readonly Results[] | undefined> => {
		// eslint-disable-next-line functional/no-expression-statement
		context.log.info(`id:${id} network name:${network}`)
		const khaosFunctions = call()
		const [targetContract, provider] = await createContract(
			context,
			id,
			network
		)
		// eslint-disable-next-line functional/no-expression-statement
		context.log.info(
			`id:${id} targetContract.address:${targetContract?.address}`
		)
		const toBlockNumber = await whenDefined(provider, getToBlockNumber)
		// eslint-disable-next-line functional/no-expression-statement
		context.log.info(`id:${id} toBlockNumber:${toBlockNumber}`)
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
		// eslint-disable-next-line functional/no-expression-statement
		context.log.info(`id:${id} event name:${event?.data}`)
		const events = await whenDefinedAll(
			[fromBlock, toBlockNumber, targetContract, event?.data],
			([from, to, behavior, ev]) =>
				getEvents(context, behavior, from, to, id, ev)
		)
		// eslint-disable-next-line functional/no-expression-statement
		context.log.info(`id:${id} event count:${events?.length}`)
		const computed = await whenDefined(events, (x) =>
			Promise.all(x.map(compute(context, id, network)))
		)
		// eslint-disable-next-line functional/no-expression-statement
		await whenDefined(computed, (c) =>
			Promise.all(c.map((c) => c.query).map(saveReceivedEventHashe(id)))
		)
		return whenDefinedAll(
			[computed, targetContract],
			([computedData, contractInterface]) =>
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
						address: contractInterface.address,
						results: computedData.map((x) => x.oraclized),
						sent: Boolean(sent),
					}))
				)
		)
	}

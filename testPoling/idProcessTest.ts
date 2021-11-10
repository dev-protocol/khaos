/* eslint-disable functional/no-conditional-statement */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Context } from '@azure/functions'
import { getEvents } from '../oracle/getEvents/getEvents'
import { whenDefined } from '@devprotocol/util-ts'
import { NetworkName } from '../common/types'
import { whenDefinedAll } from '@devprotocol/util-ts'
import { call } from '@devprotocol/khaos-functions'
import { compute } from '../oracle/compute/compute'
import { createContract } from '../oracle/createContract/createContract'

export const idProcessTest =
	(context: Context, network: NetworkName) =>
	async (id: string, fromBlock: number, toBlockNumber: number): Promise<void> => {
		// eslint-disable-next-line functional/no-expression-statement
		context.log.info(`id:${id} network name:${network}`)
		const khaosFunctions = call()
		const [targetContract] = await createContract(
			context,
			id,
			network
		)
		context.log.info(
			`id:${id} block from:${fromBlock || 0} to ${toBlockNumber || 0}`
		)
		const event = await khaosFunctions({
			id,
			method: 'event',
			options: { network },
		})
		context.log.info(`id:${id} event name:${event?.data}`)
		const events = await whenDefinedAll(
			[fromBlock, toBlockNumber, targetContract, event?.data],
			([from, to, behavior, ev]) =>
				getEvents(context, behavior, from, to, id, ev)
		)
		context.log.info(`id:${id} event count:${events?.length}`)
		const computed = await whenDefined(events, (x) =>
			Promise.all(x.map(compute(context, id, network)))
		)
		if (typeof computed === 'undefined') {
			context.log.info(`id:${id} computed is undefind`)
			return
		}
		context.log.info(`id:${id} computed name:${computed[0].packed?.data?.name}`)
		context.log.info(`id:${id} computed arg:${computed[0].packed?.data?.args[0]}`)
	}

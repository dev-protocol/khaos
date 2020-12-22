import { AzureFunction, Context } from '@azure/functions'
import { ids } from '@devprotocol/khaos-functions'
import { idProcess } from '../oracle/idProcess/idProcess'
import { notification } from '../oracle/notification/notification'

const handleTimer: AzureFunction = async function (
	context: Context,
	myTimer: any
): Promise<void> {
	// eslint-disable-next-line functional/no-expression-statement
	context.log.info('event batch is started.')

	// eslint-disable-next-line functional/no-conditional-statement
	if (myTimer.IsPastDue) {
		// eslint-disable-next-line functional/no-expression-statement
		context.log.warn('Timer function is running late!')
	}

	const dirs = await ids()
	const oraclizer = idProcess(
		context,
		process.env.KHAOS_NETWORK === 'mainnet' ? 'mainnet' : 'ropsten'
	)
	const results = await Promise.all(dirs.map((x) => x.id).map(oraclizer))
	// eslint-disable-next-line functional/no-expression-statement
	await Promise.all(results.map(notification))

	// eslint-disable-next-line functional/no-expression-statement
	context.log.info('event batch is finished.', results)
}

export default handleTimer

import { AzureFunction, Context } from '@azure/functions'
import { getIds } from '../oracle/getIds/getIds'
import { idProcess } from '../oracle/idProcess/idProcess'
import path from 'path'
import { notification } from '../oracle/notification/notification'

// eslint-disable-next-line functional/functional-parameters
const handleTimer = (): AzureFunction =>
	async function (context: Context, myTimer: any): Promise<void> {
		// eslint-disable-next-line functional/no-expression-statement
		context.log.info('event batch is started.')

		// eslint-disable-next-line functional/no-conditional-statement
		if (myTimer.IsPastDue) {
			// eslint-disable-next-line functional/no-expression-statement
			context.log.warn('Timer function is running late!')
		}

		const dirPath = path.join(__dirname, '..', '..', 'functions')
		const dirs = getIds(dirPath)
		const oraclizer = idProcess(
			process.env.NETWORK === 'mainnet' ? 'mainnet' : 'ropsten'
		)
		const results = await Promise.all(dirs.map(oraclizer))
		// eslint-disable-next-line functional/no-expression-statement
		await Promise.all(results.map(notification))

		// eslint-disable-next-line functional/no-expression-statement
		context.log.info('event batch is finished.', results)
	}

export default handleTimer

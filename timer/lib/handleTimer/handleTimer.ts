import { AzureFunction, Context } from '@azure/functions'
import { getIds } from '../../../oracle/getIds/getIds'
import { idProcess } from '../../../oracle/idProcess/idProcess'
import path from 'path'
import { NetworkName } from '../../../functions/address'
import { notification } from '../../../oracle/notification/notification'

export const handleTimer = (network: NetworkName): AzureFunction =>
	async function (context: Context, myTimer: any): Promise<void> {
		// eslint-disable-next-line functional/no-expression-statement
		context.log.info('event batch is started.')

		// eslint-disable-next-line functional/no-conditional-statement
		if (myTimer.IsPastDue) {
			// eslint-disable-next-line functional/no-expression-statement
			context.log.warn('Timer function is running late!')
		}

		const dirPath = path.join(__dirname, '..', '..', '..', 'functions')
		const dirs = getIds(dirPath)
		const oraclizer = idProcess(network)
		const results = await Promise.all(dirs.map(oraclizer))
		// eslint-disable-next-line functional/no-expression-statement
		await Promise.all(results.map(notification))

		// eslint-disable-next-line functional/no-expression-statement
		context.log.info('event batch is finished.', results)
	}

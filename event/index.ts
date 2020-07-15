import { AzureFunction, Context } from '@azure/functions'
import { getIds } from './getIds/getIds'
import { idProcess } from './idProcess/idProcess'
import path from 'path'
import Web3 from 'web3'

const timerTrigger: AzureFunction = async function (
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

	const dirPath = path.join(__dirname, '..', 'functions')
	const dirs = getIds(dirPath)
	const endpoint = process.env.WEB3_URL || ''
	const web3 = new Web3(new Web3.providers.HttpProvider(endpoint))
	const oraclizer = idProcess(web3)
	const results = await Promise.all(dirs.map(oraclizer))

	// eslint-disable-next-line functional/no-expression-statement
	context.log.info('event batch is finished.', results)
}

export default timerTrigger
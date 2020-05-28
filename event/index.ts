/* eslint-disable functional/no-conditional-statement */
/* eslint-disable functional/no-expression-statement */
import { AzureFunction, Context } from '@azure/functions'
import { getDirectoryList, getApprovedBlock } from './utils'
import { importAddress } from './importAddress/importAddress'
import { getLastBlock } from './getLastBlock/getLastBlock'
import { getEvents } from './getEvents/getEvents'
import { importOraclize } from './importOraclize/importOraclize'
import { CosmosClient } from '@azure/cosmos'
import { readSecret } from './db/db'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3')

// TODO 環境変数にする
const WEB3_URL = 'https://mainnet.jsjsjs'
const CALLBACK_ABI = ''

const timerTrigger: AzureFunction = async function (
	context: Context,
	myTimer: any
): Promise<void> {
	// eslint-disable-next-line functional/no-let
	let timeStamp = new Date().toISOString()

	context.log.info('event batch is started.', timeStamp)

	if (myTimer.IsPastDue) {
		context.log.warn('Timer function is running late!')
	}
	const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_URL))
	const approvedBlock = await getApprovedBlock(web3)

	const dirs = getDirectoryList('../functions')
	// eslint-disable-next-line functional/no-loop-statement
	for (const dir of dirs) {
		const fn = await importAddress(dir)
		const address = await fn()
		const lastBlock = await getLastBlock(dir)
		const events = await getEvents(
			web3,
			address.toString(),
			lastBlock,
			approvedBlock
		)
		if (events.length === 0) {
			continue
		}
		const oraclize = await importOraclize(dir)
		const callbackInstance = await new web3.eth.Contract(
			JSON.parse(CALLBACK_ABI),
			address
		)
		// eslint-disable-next-line functional/no-loop-statement
		for (const event of events) {
			const data = event.returnValues.data
			const jsonData = JSON.parse(data)
			const secret = await readSecret(CosmosClient)(jsonData.s)
			const result = await oraclize(secret.resource?.secret!, jsonData)
			await callbackInstance.methds.khaosCallBack().send(result)
		}
	}
	timeStamp = new Date().toISOString()
	context.log.info('event batch is finished.', timeStamp)
}

export default timerTrigger

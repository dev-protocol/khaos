/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statement */
/* eslint-disable functional/no-throw-statement */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/no-conditional-statement */
import { AzureFunction, Context } from '@azure/functions'
import { getIds } from './getIds/gitIds'
import { importAddress } from './importAddress/importAddress'
import { getLastBlock } from './getLastBlock/getLastBlock'
import { getEvents } from './getEvents/getEvents'
import { importOraclize } from './importOraclize/importOraclize'
import { CosmosClient } from '@azure/cosmos'
import { readSecret } from './../common/db/secret'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3')

const CALLBACK_ABI =
	'[{"constant":false,"inputs":[{"internalType":"string","name":"_data","type":"string"}],"name":"khaosCallback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]'

// const getData = async function (event: ReadonlyMap<string, any>): Promise<any> {
// 	const data = event.get('returnValues').get('data')
// 	return JSON.parse(data)
// }

// const getSecret = async function (json: any): Promise<any> {
// 	return await readSecret(CosmosClient)(json.s)
// }

const idProcess = async function (id: string): Promise<void> {
	const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_URL))
	const currentBlockNumber = await web3.eth.getBlockNumber()
	const fn = await importAddress(id)
	const address = await fn()
	const lastBlock = await getLastBlock(id)
	const events = await getEvents(
		web3,
		address.toString(),
		lastBlock,
		currentBlockNumber
	)
	if (events.length === 0) {
		return
	}
	const oraclize = await importOraclize(id)
	const callbackInstance = await new web3.eth.Contract(
		JSON.parse(CALLBACK_ABI),
		address
	)
	// const jsonData = events.map(getData)
	// const secrets = jsonData.map(getSecret)

	//const resultArgs = events.map(getResults(id))
	const resultArgs = []
	for (const event of events) {
		const data = event.get('returnValues').get('data')
		const jsonData = JSON.parse(data)
		const secret = await readSecret(CosmosClient)(jsonData.s)
		if (typeof secret.resource === 'undefined') {
			throw new Error('illigal public signature')
		}
		const result = await oraclize(secret.resource.secret, jsonData)
		resultArgs.push(result)
	}
	for (const resultArg of resultArgs) {
		await callbackInstance.methds.khaosCallBack().send(resultArg)
	}
}

const timerTrigger: AzureFunction = async function (
	context: Context,
	myTimer: any
): Promise<void> {
	context.log.info('event batch is started.')

	if (myTimer.IsPastDue) {
		context.log.warn('Timer function is running late!')
	}

	const dirs = getIds('../../functions')
	dirs.map(await idProcess)
	context.log.info('event batch is finished.')
}

export default timerTrigger

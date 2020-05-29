import { importAddress } from '../importAddress/importAddress'
import { getLastBlock } from '../getLastBlock/getLastBlock'
import { getEvents } from '../getEvents/getEvents'
import { getData } from '../getData/getData'
import { getSecret } from '../getSecret/getSecret'
import { targetFilter } from '../targetFilter/targetFilter'
import { executeOraclize } from '../executeOraclize/executeOraclize'
import { sendContractMethod } from '../sendContractMethod/sendContractMethod'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3')

export const idProcess = async function (id: string): Promise<void> {
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
	const jsonData = events.map(getData)
	const oracleArgList = await Promise.all(jsonData.map(getSecret))
	const targetOracleArgList = oracleArgList.filter(targetFilter)
	const results = await Promise.all(targetOracleArgList.map(executeOraclize))
	// eslint-disable-next-line functional/no-expression-statement
	await Promise.all(results.map(sendContractMethod))
}

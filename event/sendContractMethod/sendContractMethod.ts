import { importAddress } from '../importAddress/importAddress'
import { sendInfo } from '../executeOraclize/executeOraclize'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3')

const CALLBACK_ABI =
	'[{"constant":false,"inputs":[{"internalType":"string","name":"_data","type":"string"}],"name":"khaosCallback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]'

export const sendContractMethod = async (info: sendInfo): Promise<void> => {
	const fn = await importAddress(info.khaosId)
	const address = await fn()
	const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_URL))
	const callbackInstance = await new web3.eth.Contract(
		JSON.parse(CALLBACK_ABI),
		address
	)
	// eslint-disable-next-line functional/no-expression-statement
	await callbackInstance.methds.khaosCallBack().send(info.result)
}

import test from 'ava'
import { recover } from './recover'
import Web3 from 'web3'

const message =
	'wiNc@CGIx3kcY*!ca&MtLqtoq4u2U8Nd!UpcU4cqGI$Wyw8sl3terim%3S4EMAtTOUu9kr$FpBRr8&cqpMtiNcZTLUzQ8XZz5Nmk'

test(`Returns account's address from passed message and signature`, (t) => {
	const web3 = new Web3()
	const account = web3.eth.accounts.create()
	const signature = web3.eth.accounts.sign(message, account.privateKey)
	const result = recover(signature.message, signature.signature)
	t.is(result.toLowerCase(), account.address.toLowerCase())
})

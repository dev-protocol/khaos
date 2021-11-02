/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
/* eslint-disable functional/immutable-data */

import test from 'ava'
import { idProcess, Results } from './idProcess'
import { stub } from 'sinon'
import * as secret from '../../common/db/secret'
import * as getEvents from '../getEvents/getEvents'
import { ethers } from 'ethers'
import { createContext } from '../../common/testutils'
import * as createContract from '../createContract/createContract'
import * as sendContractMethod from '../sendContractMethod/sendContractMethod'

test.serial('The process is executed successfully.', async (t) => {
	const stubbedSecretReader = stub(secret, 'reader').callsFake(
		() => async () =>
			({
				statusCode: 200,
				resource: { secret: 'dummy-secret' },
			} as any)
	)
	const provider = ethers.getDefaultProvider()
	const stubbedCreateContract = stub(
		createContract,
		'createContract'
	).callsFake(
		async () =>
			[
				new ethers.Contract(
					'0xEDEBb94c9Ec1c4B4De2Fcf92f8FA4e995460Ac13',
					'[]',
					provider
				),
				provider,
				undefined,
			] as any
	)
	const stubbedGetEvents = stub(getEvents, 'getEvents').callsFake(
		async () => [] as readonly ethers.Event[]
	)
	const stubbedSendContractMethod = stub(
		sendContractMethod,
		'sendContractMethod'
	).callsFake(() => async () => ({} as any))
	process.env.KHAOS_INFURA_ID = '8e44280aca0d4fbebad2f2849c39a83f'
	process.env.KHAOS_MNEMONIC =
		'size wish volume lecture dinner drastic easy assume pledge ribbon bunker stand drill grunt dutch'
	const context = createContext()
	const result = await idProcess(context as any, 'ropsten')('example')
	stubbedSecretReader.restore()
	stubbedGetEvents.restore()
	stubbedCreateContract.restore()
	stubbedSendContractMethod.restore()
	t.is((result as readonly Results[]).length, 0)
})

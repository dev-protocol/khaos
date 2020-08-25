/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
/* eslint-disable functional/immutable-data */

import test from 'ava'
import { idProcess, Results } from './idProcess'
import { stub } from 'sinon'
import * as lastBlock from '../db/last-block'
import * as secret from '../../common/db/secret'
import * as getEvents from '../getEvents/getEvents'
import { ethers } from 'ethers'
import { createContext } from '../../common/testutils'

test.serial('The process is executed successfully.', async (t) => {
	const stubbedReader = stub(lastBlock, 'reader').callsFake(() => async () =>
		({
			statusCode: 200,
			resource: { lastBlock: 100 },
		} as any)
	)
	const stubbedWriter = stub(lastBlock, 'writer').callsFake(() => async () =>
		({
			statusCode: 200,
		} as any)
	)
	const stubbedSecretReader = stub(secret, 'reader').callsFake(() => async () =>
		({
			statusCode: 200,
			resource: { secret: 'dummy-secret' },
		} as any)
	)
	const stubbedGetEvents = stub(getEvents, 'getEvents').callsFake(
		async () => [] as readonly ethers.Event[]
	)
	process.env.KHAOS_MNEMONIC =
		'size wish volume lecture dinner drastic easy assume pledge ribbon bunker stand drill grunt dutch'
	const context = createContext()
	const result = await idProcess(context as any, 'ropsten')('example')
	stubbedReader.restore()
	stubbedWriter.restore()
	stubbedSecretReader.restore()
	stubbedGetEvents.restore()
	console.log(result)
	t.is((result as readonly Results[]).length, 0)
})

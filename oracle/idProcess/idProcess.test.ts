/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
/* eslint-disable functional/immutable-data */

import test from 'ava'
import { idProcess, Results } from './idProcess'
import { stub } from 'sinon'
import * as lastBlock from '../db/last-block'
import * as secret from '../../common/db/secret'
import * as address from '../db/market-address'
import * as getEvents from '../getEvents/getEvents'
import { ethers } from 'ethers'

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
	const stubbedAddressReader = stub(address, 'reader').callsFake(
		() => async () =>
			({
				statusCode: 200,
				resource: { address: 'dummy-address' },
			} as any)
	)
	const stubbedGetEvents = stub(getEvents, 'getEvents').callsFake(
		async () => [] as readonly ethers.Event[]
	)
	process.env.MNEMONIC =
		'size wish volume lecture dinner drastic easy assume pledge ribbon bunker stand drill grunt dutch'
	const result = await idProcess('ropsten')('example')
	stubbedReader.restore()
	stubbedWriter.restore()
	stubbedSecretReader.restore()
	stubbedAddressReader.restore()
	stubbedGetEvents.restore()
	console.log(result)
	t.is((result as readonly Results[]).length, 0)
})

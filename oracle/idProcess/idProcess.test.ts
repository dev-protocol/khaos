/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
/* eslint-disable functional/immutable-data */

import test from 'ava'
import { idProcess, Results } from './idProcess'
import { stub } from 'sinon'
import * as lastBlock from '../db/db'
import * as secret from '../../common/db/secret'

test.serial('The process is executed successfully.', async (t) => {
	const stubbedReader = stub(lastBlock, 'reader').callsFake(() => async () =>
		({
			statusCode: 200,
			resource: { lastBlock: 100 },
		} as any)
	)
	const stubbedSecretReader = stub(secret, 'reader').callsFake(() => async () =>
		({
			statusCode: 200,
			resource: { secret: 'dummy-secret' },
		} as any)
	)
	process.env.MNEMONIC =
		'size wish volume lecture dinner drastic easy assume pledge ribbon bunker stand drill grunt dutch'
	const result = await idProcess('ropsten')('example')
	stubbedReader.restore()
	stubbedSecretReader.restore()
	t.is((result as readonly Results[])[0].address, '0x20......')
	t.is((result as readonly Results[])[1].address, '0x20......')
	t.is((result as readonly Results[])[0].sent, true)
	t.is((result as readonly Results[])[1].sent, true)
})

import test from 'ava'
import { getIds } from './getIds'

test('get a directory listing just under the path', async (t) => {
	const result = getIds('./oracle')
	t.is(result.length, 11)
	t.true(result.includes('db'))
	t.true(result.includes('executeOraclize'))
	t.true(result.includes('getData'))
	t.true(result.includes('getEvents'))
	t.true(result.includes('getIds'))
	t.true(result.includes('getLastBlock'))
	t.true(result.includes('getSecret'))
	t.true(result.includes('idProcess'))
	t.true(result.includes('importAddress'))
	t.true(result.includes('importOraclize'))
	t.true(result.includes('sendContractMethod'))
})

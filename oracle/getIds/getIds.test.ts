import test from 'ava'
import { getIds } from './getIds'

test('get a directory listing just under the path', async (t) => {
	const result = getIds('./functions')
	t.is(result.length, 2)
	t.true(result.includes('example'))
	t.true(result.includes('github-market'))
})

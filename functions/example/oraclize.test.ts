import test from 'ava'
import oraclize from './oraclize'

test('oraclize is executed.', async (t) => {
	const map = new Map<string, string>()
	map.set('key1', 'value1')
	const readonlyMap: ReadonlyMap<string, string> = map
	const res = await oraclize('', readonlyMap)
	t.is(res, '')
})

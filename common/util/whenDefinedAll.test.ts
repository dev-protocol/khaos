import test from 'ava'
import { whenDefinedAll } from './whenDefinedAll'

test(`Executes the passed function when the passed array's values are defined all`, (t) => {
	const result = whenDefinedAll(
		['', 0, [], false, 'false', '0'],
		([empty, zero, arr, f, strF, str0]) => {
			t.is(empty, '')
			t.is(zero, 0)
			t.deepEqual(arr, [])
			t.is(f, false)
			t.is(strF, 'false')
			t.is(str0, '0')
			return 'done'
		}
	)
	t.is(result, 'done')
})

test(`Returns undefined when the passed array's includes null`, (t) => {
	const result = whenDefinedAll(['', 0, [], false, null], () => true)
	t.is(result, undefined)
})

test(`Returns undefined when the passed array's includes undefined`, (t) => {
	const result = whenDefinedAll(['', 0, [], false, undefined], () => true)
	t.is(result, undefined)
})

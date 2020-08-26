import test from 'ava'
import abi from './abi'

test('Returns abi informations.', async (t) => {
	t.is(abi.toString(), 'event Query()')
})

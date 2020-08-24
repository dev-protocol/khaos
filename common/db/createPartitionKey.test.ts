import test from 'ava'
import { createPartitionKey } from './createPartitionKey'

test('Returns PartitionKeyDefinition object', (t) => {
	const res = createPartitionKey()
	t.deepEqual(res, {
		paths: ['/partition'],
	})
})

test('Returns PartitionKeyDefinition object with the passed value', (t) => {
	const res = createPartitionKey(['/category'])
	t.deepEqual(res, {
		paths: ['/category'],
	})
})

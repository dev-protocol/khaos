/* eslint-disable functional/no-return-void*/
import test from 'ava'
import { withPartitionKey } from './withPartitionKey'

test('Returns Azure Cosmos Item included the default partition key', (t) => {
	const res = withPartitionKey({ data: 'test' }, 't')
	t.deepEqual(res, {
		data: 'test',
		_partitionKey: 't',
	})
})

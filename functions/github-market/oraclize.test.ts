import test from 'ava'
import oraclize from './oraclize'
import { KhaosEventData } from './../../oracle/getData/getData'

test('The address comes back.', async (t) => {
	const data: KhaosEventData = {
		publicSignature: 'dummy-public-signature',
		key: '0eewifdnqw823nrqe9ad',
		additionalData:
			'{"property": "0x1D415aa39D647834786EB9B5a333A50e9935b796", "repository": "Akira-Taniguchi/cloud_lib"}',
	}
	const res = await oraclize('eabe72317f1de4c9369f211e99b1c0190c8b5bb3', data)
	t.is(res, '0x00......')
})

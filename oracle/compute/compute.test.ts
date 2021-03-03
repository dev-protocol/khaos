import test from 'ava'
import { ethers } from 'ethers'
import { fake, spy, stub } from 'sinon'
import * as executeOraclize from '../executeOraclize/executeOraclize'
import * as khaosFunctions from '@devprotocol/khaos-functions'
import * as getData from '../getData/getData'
import * as getSecret from '../getSecret/getSecret'
import { MarketQueryData } from '../../common/structs'
import { compute } from './compute'
import { NetworkName } from '@devprotocol/khaos-core'

const khaosFunctionsRetuns = { data: { name: 'test', args: [1, 2, 3] } }
const khaosFunctionsStub = fake(() => Promise.resolve(khaosFunctionsRetuns))
const factoryCallStub = stub(khaosFunctions, 'call').callsFake(
	() => khaosFunctionsStub
)
const oracleReturns = { khaosId: 'test', result: { test: 'oracle' } as any }
const oracleStub = fake(() => Promise.resolve(oracleReturns))
const factoryExecuteOraclizeStub = stub(
	executeOraclize,
	'executeOraclize'
).callsFake(() => oracleStub)
const getDataSpy = spy(getData, 'getData')
const getSecretFake = fake((eventData: MarketQueryData) =>
	Promise.resolve({ secret: { test: 'test' } as any, eventData })
)
const getSecretStub = stub(getSecret, 'getSecret').callsFake(getSecretFake)

test.serial('Takes id and network name and runs the process', async (t) => {
	const event = ({
		myParam: 1,
		transactionHash: 'test_tx',
	} as unknown) as ethers.Event
	const res = await compute('TEST_ID', 'TEST_NET' as NetworkName)(event)
	t.deepEqual(factoryCallStub.getCall(0).args, [])
	t.deepEqual(factoryExecuteOraclizeStub.getCall(0).args, [
		'TEST_ID',
		'TEST_NET',
	])
	t.deepEqual(getDataSpy.getCall(0).args, [event])
	t.deepEqual(getSecretStub.getCall(0).args, [getData.getData(event)])
	t.deepEqual(oracleStub.getCall(0).args, [
		await getSecretFake(getData.getData(event)),
	])
	t.deepEqual(khaosFunctionsStub.getCall(0).args, [
		{
			id: 'TEST_ID',
			method: 'pack',
			options: { results: oracleReturns.result },
		},
	])
	t.deepEqual(res, {
		oraclized: oracleReturns,
		packed: khaosFunctionsRetuns,
		query: getData.getData(event),
	})
})

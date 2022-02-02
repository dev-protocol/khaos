import test from 'ava'
import { ethers } from 'ethers'
import Sinon, { fake, spy, stub } from 'sinon'
import * as executeOraclize from '../executeOraclize/executeOraclize'
import * as khaosFunctions from '@devprotocol/khaos-functions'
import * as getData from '../getData/getData'
import * as getSecret from '../getSecret/getSecret'
import { MarketQueryData } from '../../common/structs'
import { compute } from './compute'
import { NetworkName } from '@devprotocol/khaos-core'
import { createContext } from '../../common/testutils'

test.serial('Takes id and network name and runs the process', async (t) => {
	const khaosFunctionsRetuns = { data: { name: 'test', args: [1, 2, 3] } }
	const khaosFunctionsStub = fake(() =>
		Promise.resolve(khaosFunctionsRetuns)
	) as Sinon.SinonSpy<any>
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
	const event = {
		myParam: 1,
		transactionHash: 'test_tx',
	} as unknown as ethers.Event
	const context = createContext()
	const res = await compute(
		context as any,
		'TEST_ID',
		'TEST_NET' as NetworkName
	)(event)
	t.deepEqual(factoryCallStub.getCall(0).args, [])
	t.deepEqual(factoryExecuteOraclizeStub.getCall(0).args, [
		context as any,
		'TEST_ID',
		'TEST_NET' as NetworkName,
	])
	t.deepEqual(getDataSpy.getCall(0).args, [event])
	t.deepEqual(getSecretStub.getCall(0).args, [getData.getData(event)])
	t.deepEqual(oracleStub.getCall(0).args, [
		await getSecretFake(getData.getData(event)),
	] as any)
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
	factoryCallStub.restore()
	factoryExecuteOraclizeStub.restore()
	getDataSpy.restore()
	getSecretStub.restore()
})

test.serial('oracle function returns undefined', async (t) => {
	const khaosFunctionsStub = fake(() =>
		Promise.resolve({})
	) as Sinon.SinonSpy<any>
	const factoryCallStub = stub(khaosFunctions, 'call').callsFake(
		() => khaosFunctionsStub
	)
	const oracleReturns = { khaosId: 'test', result: undefined }
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
	const event = {
		myParam: 1,
		transactionHash: 'test_tx',
	} as unknown as ethers.Event
	const context = createContext()
	const res = await compute(
		context as any,
		'TEST_ID',
		'TEST_NET' as NetworkName
	)(event)
	t.deepEqual(factoryCallStub.getCall(0).args, [])
	t.deepEqual(factoryExecuteOraclizeStub.getCall(0).args, [
		context as any,
		'TEST_ID',
		'TEST_NET' as NetworkName,
	])
	t.deepEqual(getDataSpy.getCall(0).args, [event])
	t.deepEqual(getSecretStub.getCall(0).args, [getData.getData(event)])
	t.deepEqual(oracleStub.getCall(0).args, [
		await getSecretFake(getData.getData(event)),
	] as any)
	t.deepEqual(res, {
		oraclized: oracleReturns,
		packed: undefined,
		query: getData.getData(event),
	})
	factoryCallStub.restore()
	factoryExecuteOraclizeStub.restore()
	getDataSpy.restore()
	getSecretStub.restore()
})

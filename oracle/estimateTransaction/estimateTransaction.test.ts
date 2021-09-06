import test from 'ava'
import { estimateTransaction } from './estimateTransaction'
import { ethers, BigNumber } from 'ethers'

test('returns the value of the `Contract.estimateGas.Methods` result as a string', async (t) => {
	t.plan(2)
	const args = ['test', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	const dummy = {
		estimateGas: {
			testCallback(...callArgs: readonly any[]) {
				t.deepEqual(callArgs, args)
				return Promise.resolve(BigNumber.from(123456))
			},
		},
	} as unknown as ethers.Contract
	const result = await estimateTransaction(dummy)('testCallback', args)
	t.is(result?.toString(), '123456')
})

test('returns undefined when the passed Contract instance has not the method', async (t) => {
	t.plan(1)
	const args = ['test', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	const dummy = {
		estimateGas: {
			testCall() {
				t.pass()
				return Promise.resolve(BigNumber.from(123456))
			},
		},
	} as unknown as ethers.Contract
	const result = await estimateTransaction(dummy)('testCallback', args)
	t.is(result, undefined)
})

test('returns undefined when the passed 2nd argument is undefined', async (t) => {
	t.plan(1)
	const dummy = {
		estimateGas: {
			testCallback() {
				t.pass()
				return Promise.resolve(BigNumber.from(123456))
			},
		},
	} as unknown as ethers.Contract
	const result = await estimateTransaction(dummy)(
		'testCallback',
		undefined as any
	)
	t.is(result, undefined)
})

test('returns undefined when throw a error', async (t) => {
	t.plan(2)
	const dummy = {
		estimateGas: {
			testCallback() {
				t.pass()
				// eslint-disable-next-line functional/no-promise-reject
				return Promise.reject(new Error('error'))
			},
		},
	} as unknown as ethers.Contract
	const result = await estimateTransaction(dummy)('testCallback', [1])
	t.is(result, undefined)
})

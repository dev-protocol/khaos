/* eslint-disable functional/immutable-data */
import test from 'ava'
import { getFromBlock } from './getFromBlock'

test.serial(
	'環境変数が設定されていないとき、undefinedが帰ってくる.',
	async (t) => {
		const result = await getFromBlock(100)
		t.is(result, undefined)
	}
)

test.serial('undefinedを設定した場合、undefinedが帰ってくる.', async (t) => {
	const result = await getFromBlock(undefined)
	t.is(result, undefined)
})

test.serial('環境変数に設定した値を引いて帰ってくる.', async (t) => {
	process.env.KHAOS_BLOCK_RANGE = '80'
	const result = await getFromBlock(100)
	t.is(result, 20)
})

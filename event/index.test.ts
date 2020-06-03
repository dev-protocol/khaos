/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/prefer-readonly-type */
import test from 'ava'
import { stub } from 'sinon'
import timerTrigger from './index'
import * as process from './idProcess/idProcess'

let warn: string[] = []
let info: string[] = []
const context = {
	log: {
		warn: function (str: string) {
			warn.push(str)
		},
		info: function (str: string) {
			info.push(str)
		},
	},
}

test.serial(
	'If the call is not delayed, there is no warning message.',
	async (t) => {
		warn = []
		info = []
		const stubbedReader = stub(process, 'idProcess').callsFake(() => async () =>
			new Promise((resolve) => {
				resolve(undefined)
			})
		)
		await timerTrigger(context as any, {
			IsPastDue: false,
		})
		stubbedReader.restore()
		t.is(warn.length, 0)
		t.is(info.length, 2)
		t.is(info[0], 'event batch is started.')
		t.is(info[1], 'event batch is finished.')
	}
)

test.serial('If the call is delayed, you get a warning message.', async (t) => {
	warn = []
	info = []
	const stubbedReader = stub(process, 'idProcess').callsFake(() => async () =>
		new Promise((resolve) => {
			resolve(undefined)
		})
	)
	await timerTrigger(context as any, {
		IsPastDue: true,
	})
	stubbedReader.restore()
	t.is(warn.length, 1)
	t.is(warn[0], 'Timer function is running late!')
	t.is(info.length, 2)
	t.is(info[0], 'event batch is started.')
	t.is(info[1], 'event batch is finished.')
})

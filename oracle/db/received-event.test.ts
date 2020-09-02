/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-throw-statement */
/* eslint-disable functional/no-conditional-statement */
/* eslint-disable functional/no-class */
import test from 'ava'
import { writer, isAlreadyReceived } from './received-event'
import { CosmosClient } from '@azure/cosmos'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createStub = (
	createCallback?: (options?: any) => void,
	readCallback?: (options?: any) => void,
	replaceCallback?: (options?: any) => void
) =>
	class Stub {
		public readonly databases = {
			createIfNotExists: async ({ id: database }: { readonly id: string }) => ({
				database: {
					containers: {
						createIfNotExists: async ({
							id: container,
						}: {
							readonly id: string
						}) => ({
							container: {
								items: {
									create: async (options: any) => {
										if (createCallback) {
											createCallback(options)
										}
										return {
											item: {
												container: {
													database: {
														id: database,
													},
													id: container,
												},
											},
											options,
										}
									},
								},
								item: (id: string, partitionKey: string) => ({
									read: async () => {
										if (readCallback) {
											readCallback()
										}
										return {
											item: {
												container: {
													database: {
														id: database,
													},
													id: container,
												},
												id,
												partitionKey,
											},
											resource: {
												id: '0x111111111',
												_partitionKey: '0x1',
												lastBlock: 300,
											},
										}
									},
									replace: async (options: any) => {
										if (replaceCallback) {
											replaceCallback(options)
										}
										return {
											item: {
												container: {
													database: {
														id: database,
													},
													id: container,
												},
												id,
												partitionKey,
											},
											resource: options,
										}
									},
								}),
							},
						}),
					},
				},
			}),
		}
	}

// test('write; insert new data to `Oraclization.LastBlock`', async (t) => {
// 	t.plan(4)
// 	const res = await writer(
// 		(createStub(() => t.pass()) as unknown) as typeof CosmosClient
// 	)({
// 		id: '0x00000000',
// 		lastBlock: 100,
// 	})
// 	t.is(res.item.container.database.id, 'Oraclization')
// 	t.is(res.item.container.id, 'LastBlock')
// 	t.deepEqual((res as any).options, {
// 		id: '0x00000000',
// 		lastBlock: 100,
// 		_partitionKey: '0x0',
// 	})
// })

// test('write; override the data when passed data already exists', async (t) => {
// 	t.plan(8)
// 	const store = new Map()
// 	const fake = (opts: LastBlock): void => {
// 		if (store.has(opts.id)) {
// 			throw new Error()
// 		}
// 		store.set(opts.id, opts.lastBlock)
// 	}
// 	await writer((createStub(fake) as unknown) as typeof CosmosClient)({
// 		id: '0x111111111',
// 		lastBlock: 200,
// 	})
// 	const res = await writer(
// 		(createStub(fake, undefined, () =>
// 			t.pass()
// 		) as unknown) as typeof CosmosClient
// 	)({
// 		id: '0x111111111',
// 		lastBlock: 300,
// 	})

// 	t.is(res.item.container.database.id, 'Oraclization')
// 	t.is(res.item.container.id, 'LastBlock')
// 	t.is(res.item.id, '0x111111111')
// 	t.is((res.item as any).partitionKey, '0x1')
// 	t.is(res.resource?.id, '0x111111111')
// 	t.is(res.resource?._partitionKey, '0x1')
// 	t.is(res.resource?.lastBlock, 300)
// })

// test('read; get data from `Oraclization.LastBlock`', async (t) => {
// 	t.plan(8)
// 	const res = await reader(
// 		(createStub(undefined, () => t.pass()) as unknown) as typeof CosmosClient
// 	)('0x111111111')
// 	t.is(res.item.container.database.id, 'Oraclization')
// 	t.is(res.item.container.id, 'LastBlock')
// 	t.is(res.item.id, '0x111111111')
// 	t.is((res.item as any).partitionKey, '0x1')
// 	t.is(res.resource?.id, '0x111111111')
// 	t.is(res.resource?._partitionKey, '0x1')
// 	t.is(res.resource?.lastBlock, 300)
// })

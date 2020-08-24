/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-throw-statement */
/* eslint-disable functional/no-conditional-statement */
/* eslint-disable functional/no-class */
import test from 'ava'
import { writer, reader, Secret } from './secret'
import { CosmosClient } from '@azure/cosmos'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createStub = (
	createCallback?: (arg?: any) => void,
	readCallback?: (arg?: any) => void,
	replaceCallback?: (arg?: any) => void
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
												id,
												secret: 'data',
												partition: id.slice(0, 1),
												address: 'account',
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

test('write; insert new data to `Authentication.Secrets`', async (t) => {
	t.plan(4)
	const res = await writer(
		(createStub(() => t.pass()) as unknown) as typeof CosmosClient
	)({
		id: 'test',
		secret: 'data',
		address: 'account',
	})
	t.is(res.item.container.database.id, 'Authentication')
	t.is(res.item.container.id, 'Secrets')
	t.deepEqual((res as any).options, {
		id: 'test',
		partition: 't',
		secret: 'data',
		address: 'account',
	})
})

test('write; override the data when passed data already exists', async (t) => {
	t.plan(9)
	const store = new Map()
	const fake = (opts: Secret): void => {
		if (store.has(opts.id)) {
			throw new Error()
		}
		store.set(opts.id, opts)
	}
	await writer((createStub(fake) as unknown) as typeof CosmosClient)({
		id: 'test',
		secret: 'data',
		address: 'account',
	})
	const res = await writer(
		(createStub(fake, undefined, () =>
			t.pass()
		) as unknown) as typeof CosmosClient
	)({
		id: 'test',
		secret: 'data-replaced',
		address: 'account',
	})

	t.is(res.item.container.database.id, 'Authentication')
	t.is(res.item.container.id, 'Secrets')
	t.is(res.item.id, 'test')
	t.is((res.item as any).partitionKey, 't')
	t.is(res.resource?.id, 'test')
	t.is(res.resource?.partition, 't')
	t.is(res.resource?.secret, 'data-replaced')
	t.is(res.resource?.address, 'account')
})

test('read; get data from `Authentication.Secrets`', async (t) => {
	t.plan(9)
	const res = await reader(
		(createStub(undefined, () => t.pass()) as unknown) as typeof CosmosClient
	)('test')
	t.is(res.item.container.database.id, 'Authentication')
	t.is(res.item.container.id, 'Secrets')
	t.is(res.item.id, 'test')
	t.is((res.item as any).partitionKey, 't')
	t.is(res.resource?.id, 'test')
	t.is(res.resource?.partition, 't')
	t.is(res.resource?.secret, 'data')
	t.is(res.resource?.address, 'account')
})

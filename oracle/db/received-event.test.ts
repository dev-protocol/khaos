/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-throw-statement */
/* eslint-disable functional/no-conditional-statement */
/* eslint-disable functional/no-class */
import test from 'ava'
import { writer, isAlreadyReceived, ReceivedEvent } from './received-event'
import { CosmosClient } from '@azure/cosmos'

test('write; insert new data to `Oraclization.ReceivedEvent`', async (t) => {
	const createStub = () =>
		class Stub {
			public readonly databases = {
				createIfNotExists: async ({
					id: database,
				}: {
					readonly id: string
				}) => ({
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
											return {
												resource: undefined,
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
	const res = await writer((createStub() as unknown) as typeof CosmosClient)(
		{
			id: '0x1234567890abcdef',
		},
		'example'
	)
	t.is(res.item.container.database.id, 'Oraclization')
	t.is(res.item.container.id, 'ReceivedEvent')
	t.deepEqual((res as any).options, {
		id: '0x1234567890abcdef',
		_partitionKey: 'example',
	})
})

test('write; already exist data at `Oraclization.ReceivedEvent`', async (t) => {
	const createStub = () =>
		class Stub {
			public readonly databases = {
				createIfNotExists: async ({
					id: database,
				}: {
					readonly id: string
				}) => ({
					database: {
						containers: {
							createIfNotExists: async ({
								id: container,
							}: {
								readonly id: string
							}) => ({
								container: {
									item: (id: string, partitionKey: string) => ({
										read: async () => {
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
													id: '0x1234567890abcdef',
													_partitionKey: 'example',
												},
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
	const res = await writer((createStub() as unknown) as typeof CosmosClient)(
		{
			id: '0x1234567890abcdef',
		},
		'example'
	)
	t.is(res.item.container.database.id, 'Oraclization')
	t.is(res.item.container.id, 'ReceivedEvent')
	t.deepEqual((res as any).resource, {
		id: '0x1234567890abcdef',
		_partitionKey: 'example',
	})
})

test('isAlreadyReceived; data is not exist', async (t) => {
	const createStub = () =>
		class Stub {
			public readonly databases = {
				createIfNotExists: async ({
					id: database,
				}: {
					readonly id: string
				}) => ({
					database: {
						containers: {
							createIfNotExists: async ({
								id: container,
							}: {
								readonly id: string
							}) => ({
								container: {
									item: (id: string, partitionKey: string) => ({
										read: async () => {
											return {
												resource: undefined,
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
	const res = await isAlreadyReceived(
		(createStub() as unknown) as typeof CosmosClient
	)('0x1234567890abcdef', 'example')
	t.false(res)
})

test('isAlreadyReceived; data is exist', async (t) => {
	const createStub = () =>
		class Stub {
			public readonly databases = {
				createIfNotExists: async ({
					id: database,
				}: {
					readonly id: string
				}) => ({
					database: {
						containers: {
							createIfNotExists: async ({
								id: container,
							}: {
								readonly id: string
							}) => ({
								container: {
									item: (id: string, partitionKey: string) => ({
										read: async () => {
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
													id: '0x1234567890abcdef',
													_partitionKey: 'example',
												},
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
	const res = await isAlreadyReceived(
		(createStub() as unknown) as typeof CosmosClient
	)('0x1234567890abcdef', 'example')
	t.true(res)
})

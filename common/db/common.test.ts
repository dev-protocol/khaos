/* eslint-disable functional/no-return-void */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable functional/no-conditional-statement */
/* eslint-disable functional/no-class */
import test from 'ava'
import { CosmosClient } from '@azure/cosmos'
import { createDBInstance } from './common'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createStub = (createCallback?: (options?: any) => void) =>
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
							},
						}),
					},
				},
			}),
		}
	}

test('An instance of the database is created (albeit a dummy)', async (t) => {
	const instance = await createDBInstance(
		(createStub(() => t.pass()) as unknown) as typeof CosmosClient,
		{
			database: 'dummy-database',
			container: 'dummy-container',
			partitionKey: 'd',
		},
		process.env
	)
	const result = await instance.items.create({ key: 'value' })
	t.is(result.item.container.database.id, 'dummy-database')
})

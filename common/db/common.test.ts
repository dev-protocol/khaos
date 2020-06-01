/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable functional/no-conditional-statement */
/* eslint-disable functional/no-class */
import test from 'ava'
import { CosmosClient, Container } from '@azure/cosmos'
import { createDBInstance } from './common'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createStub = (readCallback?: Function) =>
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
								item: (id: string, partitionKey: string) => ({
									read: async () => {
										if (readCallback) {
											readCallback()
										}
										return {
											resource: {
												id,
												secret: 'data',
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

test('write; insert new data to `Authentication.Secrets`', async (t) => {
	const instance = await createDBInstance(
		(createStub(() => t.pass()) as unknown) as typeof CosmosClient,
		{
			database: 'dummy-database',
			container: 'dummy-container',
		},
		process.env
	)
	const result = await instance.item('test', 'test').read()
	t.is(result.resource?.id, 'test')
})

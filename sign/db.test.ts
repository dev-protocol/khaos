/* eslint-disable functional/no-class */
import test from 'ava'
import { writer, reader } from './db'

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
								create: async (options: any) => ({
									item: {
										container: {
											database: {
												id: database,
											},
											id: container,
										},
									},
									options,
								}),
							},
							item: (id: string, partitionKey: string) => ({
								read: async () => ({
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
									},
								}),
							}),
						},
					}),
				},
			},
		}),
	}
}

test('write; insert new data to `Authentication.Secrets`', async (t) => {
	const res = await writer(Stub as any)({ id: 'test', secret: 'data' })
	t.is(res.item.container.database.id, 'Authentication')
	t.is(res.item.container.id, 'Secrets')
	t.deepEqual((res as any).options, {
		id: 'test',
		secret: 'data',
	})
})

test.todo('write; override the data when passed data already exists')

test('read; get data from `Authentication.Secrets`', async (t) => {
	const res = await reader(Stub as any)('test')
	t.is(res.item.container.database.id, 'Authentication')
	t.is(res.item.container.id, 'Secrets')
	t.is(res.item.id, 'test')
	t.is((res.item as any).partitionKey, 'test')
	t.is(res.resource?.id, 'test')
	t.is(res.resource?.secret, 'data')
})

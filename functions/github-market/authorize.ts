import bent from 'bent'
import { Authorizer } from '../authorizer'

const fn: Authorizer = async ({ message, secret }) => {
	const repos = message.split('/')
	return postViewerPermission(repos[1], repos[0], secret)
}

export default fn

type GraphQLResponse = {
	readonly data: {
		readonly repository: {
			readonly viewerPermission: string
		} | null
	}
	readonly errors?: readonly [{ readonly message: string }]
}

async function postViewerPermission(
	name: string,
	owner: string,
	token: string
): Promise<boolean> {
	const res = await post(name, owner, token)
	return res instanceof Error
		? false
		: res.errors
		? false
		: res.data.repository
		? res.data.repository.viewerPermission === 'ADMIN'
			? true
			: false
		: false
}

async function post(
	name: string,
	owner: string,
	token: string
): Promise<GraphQLResponse | Error> {
	const query = `query {
		repository(name: "${name}", owner: "${owner}") {
			viewerPermission
		}
	}`
	const authorization = `bearer ${token}`
	return bent('https://api.github.com/graphql', 'json', 'POST')(
		'',
		{
			query,
		},
		{
			Authorization: authorization,
			'User-Agent': 'https://github.com/dev-protocol/khaos',
		}
	)
		.then((res) => (res as unknown) as GraphQLResponse)
		.catch((err: Error) => err)
}

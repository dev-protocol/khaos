import { HttpRequest } from '@azure/functions'

export type Authorizer = (props: {
	readonly message: string
	readonly secret: string
	readonly req: HttpRequest
}) => Promise<boolean>

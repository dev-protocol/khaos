import { oracleArgInfo } from './../getSecret/getSecret'

export const targetFilter = (info: oracleArgInfo): boolean => {
	return typeof info.secret.resource !== 'undefined'
}

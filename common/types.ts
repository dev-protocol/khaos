/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { Secret, verify, VerifyOptions } from 'jsonwebtoken'

const _verify = (
	token: string,
	secretOrPublicKey: Secret,
	options?: VerifyOptions
) => verify(token, secretOrPublicKey, options)

export type JWTVerifyWithoutCallback = typeof _verify

export type NetworkName = 'mainnet' | 'ropsten'

export type UndefinedOr<R> = undefined | R

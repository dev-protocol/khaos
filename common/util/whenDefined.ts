import { cond, isNil, always, T } from 'ramda'
import { UndefinedOr } from '../types'

export const whenDefined = <D, F>(
	depends: D,
	fn: (d: NonNullable<D>) => F
): UndefinedOr<F> =>
	cond([
		[isNil, always(undefined)],
		[T, (deps) => fn(deps as NonNullable<D>)],
	])(depends)

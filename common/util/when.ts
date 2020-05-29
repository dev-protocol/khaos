import { cond, isNil, always, T } from 'ramda'

export const when = <D, F>(
	depends: D,
	fn: (d: NonNullable<D>) => F
): undefined | F =>
	cond([
		[isNil, always(undefined)],
		[T, always(fn(depends as NonNullable<D>))],
	])(depends)

import { cond, always, T } from 'ramda'
import { UndefinedOr } from '../types'
import { isNotNil } from './isNotNil'
import { whenDefined } from './whenDefined'

const passAll = <D>(depends: D): boolean =>
	depends instanceof Array ? depends.every(isNotNil) : isNotNil(depends)

export function whenDefinedAll<D1, F>(
	depends: readonly [D1],
	fn: (d: readonly [NonNullable<D1>]) => F
): UndefinedOr<F>
export function whenDefinedAll<D1, D2, F>(
	depends: readonly [D1, D2],
	fn: (d: readonly [NonNullable<D1>, NonNullable<D2>]) => F
): UndefinedOr<F>
export function whenDefinedAll<D1, D2, D3, F>(
	depends: readonly [D1, D2, D3],
	fn: (d: readonly [NonNullable<D1>, NonNullable<D2>, NonNullable<D3>]) => F
): UndefinedOr<F>
export function whenDefinedAll<D1, D2, D3, D4, F>(
	depends: readonly [D1, D2, D3, D4],
	fn: (
		d: readonly [
			NonNullable<D1>,
			NonNullable<D2>,
			NonNullable<D3>,
			NonNullable<D4>
		]
	) => F
): UndefinedOr<F>
export function whenDefinedAll<D1, D2, D3, D4, D5, F>(
	depends: readonly [D1, D2, D3, D4, D5],
	fn: (
		d: readonly [
			NonNullable<D1>,
			NonNullable<D2>,
			NonNullable<D3>,
			NonNullable<D4>,
			NonNullable<D5>
		]
	) => F
): UndefinedOr<F>
export function whenDefinedAll<D1, D2, D3, D4, D5, D6, F>(
	depends: readonly [D1, D2, D3, D4, D5, D6],
	fn: (
		d: readonly [
			NonNullable<D1>,
			NonNullable<D2>,
			NonNullable<D3>,
			NonNullable<D4>,
			NonNullable<D5>,
			NonNullable<D6>
		]
	) => F
): UndefinedOr<F>
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function whenDefinedAll(depends: any, fn: any): any {
	return whenDefined(
		depends,
		cond([
			[passAll, (deps) => fn(deps)],
			[T, always(undefined)],
		])
	)
}

import { isNil, complement } from 'ramda'

export const isNotNil = <T>(t: T): t is NonNullable<T> => complement(isNil)(t)

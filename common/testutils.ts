/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/no-return-void */

export const createContext = () => {
	const warn: string[] = []
	const info: string[] = []
	return {
		log: {
			warn: function (str: string) {
				warn.push(str)
			},
			info: function (str: string) {
				info.push(str)
			},
		},
		warn,
		info,
	}
}

export const getData = function (event: ReadonlyMap<string, any>): any {
	const data = event.get('returnValues').get('data')
	return JSON.parse(data)
}

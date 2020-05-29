import { readdirSync } from 'fs'

export function getIds(dirPath: string): readonly string[] {
	const dirList = readdirSync(dirPath, {
		withFileTypes: true,
	})
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name)

	return dirList
}

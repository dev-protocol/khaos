import { readdirSync } from 'fs'

export function getDirectoryList(dirPath: string): readonly string[] {
	// eslint-disable-next-line functional/no-let
	let dirList: readonly string[] = []

	// eslint-disable-next-line functional/no-expression-statement
	dirList = readdirSync(dirPath, {
		withFileTypes: true,
	})
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name)

	return dirList
}

// TODO 環境変数にすること
const APPROVAL = 30
export async function getApprovedBlock(web3: any): Promise<number> {
	const currentBlockNumber = await web3.eth.getBlockNumber()
	return currentBlockNumber - Number(APPROVAL)
}

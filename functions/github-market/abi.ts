import { Abi } from '../abi'

const abi: Abi = [
	'function khaosCallback(string memory _githubRepository, uint256 _status, string memory _message) external',
	'event Query(string githubRepository, string publicSignature)',
]

export default abi

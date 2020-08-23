import { Abi } from '../abi'

// eslint-disable-next-line functional/functional-parameters
const fn: Abi = () => {
	return [
		'function khaosCallback(string memory _githubRepository, uint256 _status, string memory _message) external',
		'event Query(string githubRepository, string publicSignature)',
	]
}

export default fn

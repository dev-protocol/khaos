import test from 'ava'
import abi from './abi'

test('Returns mainnet address', async (t) => {
	t.is(
		abi.toString(),
		'function khaosCallback(string memory _githubRepository, uint256 _status, string memory _message) external,event Query(string githubRepository, string publicSignature, address account)'
	)
})

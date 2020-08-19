import { Address } from '../address'

const fn: Address = (network) => {
	// TODO
	return network === 'mainnet' ? '0x10......' : '0x20......'
}

export default fn

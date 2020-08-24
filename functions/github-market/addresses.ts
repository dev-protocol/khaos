import { Addresses } from '../addresses'

const fn: Addresses = async (net) =>
	net === 'mainnet' ? '0x1' : '0x7222ec13791b8A52376D21Ab9054D12017Ad5e7A'

export default fn

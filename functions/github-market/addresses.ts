import { Addresses } from '../addresses'

const fn: Addresses = async (net) =>
	net === 'mainnet' ? '0x1' : '0xea76F3d6340f6aC253305fD7ddF2831A3BE4D347'

export default fn

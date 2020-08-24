import { Addresses } from '../addresses'

const fn: Addresses = async (net) => (net === 'mainnet' ? '0x1' : '0x2')

export default fn

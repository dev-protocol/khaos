import { Addresses } from '../addresses'

const fn: Addresses = async (net) =>
	net === 'mainnet' ? '0x1' : '0xE071bb5861e2352C89992799896D124F1bA5d599'

export default fn

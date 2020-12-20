import { Addresses } from '../addresses'

const fn: Addresses = async ({ network: net }) =>
	net === 'mainnet'
		? '0x3cB902625a2B38929f807f9c841F7aecBbCe7702'
		: '0xE071bb5861e2352C89992799896D124F1bA5d599'

export default fn

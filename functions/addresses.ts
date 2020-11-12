import { NetworkName } from '../common/types'

export type Addresses = (net: NetworkName) => Promise<string>

export type NetworkName = 'mainnet' | 'ropsten'

export type Addresses = (net: NetworkName) => Promise<string>

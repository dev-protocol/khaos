export type NetworkName = 'mainnet' | 'ropsten'

export type Address = (network: NetworkName) => string

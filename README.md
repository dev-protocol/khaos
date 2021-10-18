| Pipeline         | Status                                                                                                                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ethereum Mainnet | [![Build Status](https://dev.azure.com/dev-protocol/Khaos/_apis/build/status/khaos-eth-mainnet?branchName=main)](https://dev.azure.com/dev-protocol/Khaos/_build/latest?definitionId=7&branchName=main) |
| Ethereum Ropsten | [![Build Status](https://dev.azure.com/dev-protocol/Khaos/_apis/build/status/khaos-eth-ropsten?branchName=main)](https://dev.azure.com/dev-protocol/Khaos/_build/latest?definitionId=6&branchName=main) |
| Arbitrum One     | [![Build status](https://dev.azure.com/dev-protocol/Khaos/_apis/build/status/khaos-arb-one)](https://dev.azure.com/dev-protocol/Khaos/_build/latest?definitionId=12)                                    |
| Arbitrum Rinkeby | [![Build status](https://dev.azure.com/dev-protocol/Khaos/_apis/build/status/khaos-arb-rinkeby)](https://dev.azure.com/dev-protocol/Khaos/_build/latest?definitionId=11)                                |

# Important addresses

| Khaos callback sender | Address                                      |
| --------------------- | -------------------------------------------- |
| Ethereum Mainnet      | `0x1c969CD76818769205F52BC25b93e2aFE05B386E` |
| Ethereum Ropsten      | `0x7654a20D1502471230a6C454c908c73cF040e22C` |
| Arbitrum One Mainnet  | `0xc9f64eC1AADdD00ddf68fcDe85397d5C29197C95` |
| Arbitrum One Rinkeby  | `0x913404b5d02E9F685D793f23FD8774312668CE1B` |

_**Keep in mind that these addresses are subject to change in the future. If you use these addresses in your smart contract, you will also need to implement a mechanism to change their values.**_

# What's Khaos?

Khaos is an oracle service designed to bring Internet data into blockchains while keeping secret information, such as secret tokens, under wraps. Initially, we will only support Dev Protocol, but we plan to open it up in the future.

# How does it work?

Khaos has two interfaces, Authentication, and Oraclize. The authentication interface authenticates that the user is a credential holder and returns a unique public key. The oraclize interface brings data across the Internet to the blockchain while hiding secret information through public keys.

## How Khaos's authentication interface works

When Khaos receives an authentication request from a user, it executes an authentication method. The authentication request contains secret information for authentication (usually a secret token) and a message(like a user ID) that expects to be authenticated by that secret information. If the authentication method is passed, Khaos returns the public key paired with the secret information. By retrieving the message with its public key, it guarantees the authenticity of the message while hiding the secret information. An authentication method executed by an authentication request is freely extendable by the user.

![How Khaos Stores Confidentials](/images/how-khaos-stores-confidentials.png)

[Created by SequenceDiagram.org](https://sequencediagram.org/index.html#initialData=C4S2BsFMAIAkHsDu0DSALAhvAztAysPAE6S4DC8AdgGYgAmkloG42AUGwCICCADr9ABiRKsEZ0AtAD5APBuAYffRZceSEQBuqgFwAlSAEcArqWC4MB4GkagAxhlBU2leGOjwNRaPMU58q95u5zNEpoAFtIC3g6XAAjAE9oA2xVCUgADzFKBjpoNi9MHxV1FKkASSZVSgidfSNsYDZysSIq4Gl8pV9iohrsXipkx2cYN1VPBQLlPy0CYhhrKloGJhAWPInOovdpHn4hEQqsmuADFtxeDBASHN4DGPAQa2gAa0g4oA)

## How Khaos's oraclize interface works

Khaos monitors some contract events in batches. The target of the monitoring can be any address that a user deploys to. The user-deployed contract makes an oraclize request to Khaos by emitting a specified event (i.e., `Query`) according to the interface; when Khaos receives the oraclize request, it fetches some data from the Internet according to the event messages. The data is fetched into blockchains by calling the contract's callback method according to the event messages. The data fetching method executed by the oraclize request is freely extendable by the user. An authentication method executed by an authentication request is freely extendable by the user.

![How Khaos Oraclizes](/images/how-khaos-oraclizes.png)

[Created by SequenceDiagram.org](https://sequencediagram.org/index.html#initialData=C4S2BsFMAIAkHsDu0DSALAhvAztA8gE4YDG4IAXpNgFDUAiAggA5PQBiB8AdsJFwCYBaAHwBhbsCLFg2AFwAlSAEcArlRnR+GYBmgAzSMGJpqAI3gAPaPABukAtHE8pM2QFEAtmFnQABgEU1AgBPX2hIOx5qcHh4VgBZbjB4Bwi+GWpAHg3AGH30LFwAZXs7AhEnSRJXNkNjaGALanKXbBEcvJxoIoIShUMVAi5ceuo+fizczA6ukpEASR57LkNe1XVqed4Bw1aJ-M7i+17sJm5sSHH2woPSsQlm2VEMcHBTEgBrRrvKluFGFnZOAsBL1gP1BvoamhIPxNNoMNQgA)

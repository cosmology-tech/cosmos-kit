# cosmos-kit

<p align="center" width="100%">
    <img height="90" src="https://user-images.githubusercontent.com/545047/190171432-5526db8f-9952-45ce-a745-bea4302f912b.svg" />
</p>

<p align="center" width="100%">
  <a href="https://github.com/cosmology-tech/cosmos-kit/actions/workflows/run-tests.yml">
    <img height="20" src="https://github.com/cosmology-tech/cosmos-kit/actions/workflows/run-tests.yml/badge.svg" />
  </a>
  <a href="https://www.npmjs.com/package/@cosmos-kit/react">
    <img height="20" src="https://img.shields.io/npm/dt/@cosmos-kit/react" />
  </a>
   <a href="https://github.com/cosmology-tech/cosmos-kit/blob/main/packages/core/LICENSE"><img height="20" src="https://img.shields.io/badge/license-BSD%203--Clause%20Clear-blue.svg"></a>
   <a href="https://www.npmjs.com/package/@cosmos-kit/react"><img height="20" src="https://img.shields.io/github/package-json/v/cosmology-tech/cosmos-kit?filename=packages%2Freact%2Fpackage.json"></a>
</p>

CosmosKit is a wallet adapter for developers to build apps that quickly and easily interact with Cosmos blockchains and wallets.

@cosmos-kit/react is the React integration for CosmosKit.

## Documentation

[docs.cosmoskit.com](https://docs.cosmoskit.com)

## Installation

```sh
yarn add @cosmos-kit/react @cosmos-kit/core @cosmos-kit/keplr chain-registry
```

## Provider

- [ChainProvider](https://docs.cosmoskit.com/chain-provider)

- [WalletProvider](https://docs.cosmoskit.com/wallet-provider)

Compared to `WalletProvider`, which limits connection of only one chain with one wallet type at a time, `ChainProvider` allows multipule chains connected at a time, but limits one wallet type. It means if you choose to connect `Keplr`, you cannot connect `Cosmostation` at the same time.

## Hooks

- [useChain](https://docs.cosmoskit.com/use-chain)
  
- [useWallet](https://docs.cosmoskit.com/use-wallet)

Basically these two hooks have most same functionalities, except `useChain` consumes `ChainProvider` while `useWallet` consumes `WalletProvider`.


## Credits

🛠 Built by Cosmology — if you like our tools, please consider delegating to [our validator ⚛️](https://cosmology.tech/validator)

Code built with the help of these related projects:

- [create-cosmos-app](https://github.com/cosmology-tech/create-cosmos-app) Set up a modern Cosmos app by running one command ⚛️
- [chain-registry](https://github.com/cosmology-tech/chain-registry) an npm module for the official Cosmos chain-registry

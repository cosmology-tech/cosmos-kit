# cosmos-kit

<p align="center" width="100%">
    <img height="90" src="https://user-images.githubusercontent.com/545047/190171432-5526db8f-9952-45ce-a745-bea4302f912b.svg" />
</p>

<p align="center" width="100%">
  <a href="https://github.com/cosmology-tech/cosmos-kit/actions/workflows/run-tests.yml">
    <img height="20" src="https://github.com/cosmology-tech/cosmos-kit/actions/workflows/run-tests.yml/badge.svg" />
  </a>
  <a href="https://www.npmjs.com/package/@cosmos-kit/core">
    <img height="20" src="https://img.shields.io/npm/dt/@cosmos-kit/core" />
  </a>
   <a href="https://github.com/cosmology-tech/cosmos-kit/blob/main/LICENSE"><img height="20" src="https://img.shields.io/badge/license-BSD%203--Clause%20Clear-blue.svg"></a>
   <a href="https://www.npmjs.com/package/@cosmos-kit/core"><img height="20" src="https://img.shields.io/github/package-json/v/cosmology-tech/cosmos-kit?filename=packages%2Fcore%2Fpackage.json"></a>
</p>

CosmosKit is a wallet adapter for developers to build apps that quickly and easily interact with Cosmos blockchains and wallets.

## 🏁 Quickstart

Get started quickly by using [create-cosmos-app](https://github.com/cosmology-tech/create-cosmos-app) to help you build high-quality Cosmos apps fast!

## ⚙️ Configuration

Check out [our docs here](https://docs.cosmology.zone/cosmos-kit/get-started) to configure CosmosKit.

## ⚛️ CosmJS Signers

If you want to get a cosmjs stargate or cosmwasm signer, [here are docs for our hooks](https://docs.cosmology.zone/cosmos-kit/hooks)

## 📦 Packages

| Name                                                | Type          | Description                                                                            |
| --------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------- |
| [@cosmos-kit/core](packages/core)                   | Core          | Core CosmosKit functionality                                                           |
| [@cosmos-kit/react](packages/react)                 | UI            | A wallet adapter for React with mobile WalletConnect support for the Cosmos ecosystem. |
| [@cosmos-kit/walletconnect](packages/walletconnect) | WalletConnect | Mobile WalletConnect support for the Cosmos ecosystem.                                 |

## 📦 Wallets

| Name                                                                      | Type          | Description                                                                                                                  |
| ------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [@cosmos-kit/react](packages/react)                                       | UI            | A wallet adapter for React with mobile WalletConnect support for the Cosmos ecosystem.                                       |
| [@cosmos-kit/coin98-extension/](wallets/coin98-extension/)                | Extension     | Coin98 Web Extension Wallet integration.                                                                                     |
| [@cosmos-kit/coin98](wallets/coin98)                                      | Root Wallet   | Coin98 Wallet integration                                                                                                    |
| [@cosmos-kit/cosmostation-extension/](wallets/cosmostation-extension/)    | Extension     | Cosmostation Web Extension Wallet integration.                                                                               |
| [@cosmos-kit/cosmostation-mobile/](wallets/cosmostation-mobile/)          | WalletConnect | Cosmostation Mobile Wallet integration.                                                                                      |
| [@cosmos-kit/cosmostation](wallets/cosmostation)                          | Root Wallet   | Cosmostation Wallet integration. Use this if you want to integrate both extension & mobile wallet connect                    |
| [@cosmos-kit/keplr-extension/](wallets/keplr-extension/)                  | Extension     | Keplr Web Extension Wallet integration.                                                                                      |
| [@cosmos-kit/keplr-mobile/](wallets/keplr-mobile/)                        | WalletConnect | Keplr Mobile Wallet integration.                                                                                             |
| [@cosmos-kit/keplr](wallets/keplr)                                        | Root Wallet   | Keplr Wallet integration. Use this if you want to integrate both extension & mobile wallet connect                           |
| [@cosmos-kit/leap](wallets/leap)                                          | Root Wallet   | Leap Wallet integration. Use this if you want to integrate the extension, no mobile wallet connect support yet.              |
| [@cosmos-kit/omni](wallets/omni)                                          | Root Wallet   | Omni Wallet integration. Use this if you want to integrate the extension, no mobile wallet connect support yet.              |
| [@cosmos-kit/owallet-extension/](wallets/owallet-extension/)              | Extension     | OWallet Web Extension Wallet integration.                                                                                    |
| [@cosmos-kit/owallet](wallets/owallet)                                    | Root Wallet   | OWallet Wallet integration. Use this if you want to integrate the extension, no mobile wallet connect support yet.           |
| [@cosmos-kit/station-extension](wallets/station-extension)                | Extension     | Station Wallet integration. Use this if you want to integrate the extension, no mobile wallet connect support yet.           |
| [@cosmos-kit/station](wallets/station)                                    | Root Wallet   | Station Wallet integration. Use this if you want to integrate the extension, no mobile wallet connect support yet.           |
| [@cosmos-kit/trust](wallets/trust)                                        | Root Wallet   | Trust Wallet integration. Use this if you want to integrate the extension, no mobile wallet connect support yet.             |
| [@cosmos-kit/vectis](wallets/vectis)                                      | Root Wallet   | Vectis Wallet integration. Use this if you want to integrate the extension, no mobile wallet connect support yet.            |
| [@cosmos-kit/xdefi-extension](wallets/xdefi-extension)                    | Root Wallet   | XDEFI Wallet (Extension) integration. Use this if you want to integrate the extension, no mobile wallet connect support yet. |
| [@cosmos-kit/shell](wallets/shell)                                        | Root Wallet   | Shell Wallet integration. Use this if you want to integrate the extension, no mobile wallet connect support yet.             |
| [@cosmos-kit/tailwind-extension](wallets/tailwind-extension/)             | Extension     | TAILWIND Wallet extension. Use this if you want to integrate the TAILWIND Chrome Extension                                   |
| [@cosmos-kit/tailwind](wallets/tailwind/)                                 | Root Wallet   | TAILWIND Wallet integration. Use this if you want to integrate any TAILWIND wallet. No mobile support yet.                   |
| [@cosmos-kit/galaxy-station-extension](wallets/galaxy-station-extension/) | Extension     | Galaxy Station Wallet extension. Use this if you want to integrate the Galaxy Station Chrome Extension                       |
| [@cosmos-kit/galaxy-station](wallets/galaxy-station/)                     | Root Wallet   | Galaxy Station Wallet integration. Use this if you want to integrate any Galaxy Station wallet. No mobile support yet.       |
| [@cosmos-kit/cdcwallet-extension/](wallets/cdcwallet-extension/)          | Extension     | Crypto.com Web Extension Wallet integration.                                                                                 |
| [@cosmos-kit/cdcwallet](wallets/cdcwallet)                                | Root Wallet   | Crypto.com Wallet integration. Use this if you want to integrate the extension, no mobile wallet connect support yet.        |

### ✨ Example: [@cosmos-kit/example](packages/example)

An example Next.js project integrating `@cosmos-kit/react` wallet adapter.

## 🔌 Integrating Wallets

See our docs on [integrating your wallet](https://docs.cosmology.zone/cosmos-kit/integrating-wallets)

### 🚀 Running Example

```sh
yarn build
cd packages/example
yarn dev
```

## 🛠 Developing

Checkout the repository and bootstrap the yarn workspace:

```sh
# Clone the repo.
git clone https://github.com/cosmology-tech/cosmos-kit
cd cosmos-kit
yarn
```

### Building

```sh
yarn build
```

### Publishing

```
lerna publish
# lerna publish minor
# lerna publish major
```

## Related

Checkout these related projects:

- [@cosmology/telescope](https://github.com/cosmology-tech/telescope) Your Frontend Companion for Building with TypeScript with Cosmos SDK Modules.
- [@cosmwasm/ts-codegen](https://github.com/CosmWasm/ts-codegen) Convert your CosmWasm smart contracts into dev-friendly TypeScript classes.
- [chain-registry](https://github.com/cosmology-tech/chain-registry) Everything from token symbols, logos, and IBC denominations for all assets you want to support in your application.
- [cosmos-kit](https://github.com/cosmology-tech/cosmos-kit) Experience the convenience of connecting with a variety of web3 wallets through a single, streamlined interface.
- [create-cosmos-app](https://github.com/cosmology-tech/create-cosmos-app) Set up a modern Cosmos app by running one command.
- [interchain-ui](https://github.com/cosmology-tech/interchain-ui) The Interchain Design System, empowering developers with a flexible, easy-to-use UI kit.
- [starship](https://github.com/cosmology-tech/starship) Unified Testing and Development for the Interchain.

## Credits

🛠 Built by Cosmology — if you like our tools, please consider delegating to [our validator ⚛️](https://cosmology.zone/validator)

## Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating this software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the code, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.

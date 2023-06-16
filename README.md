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

Check out [our docs here](https://docs.cosmoskit.com/get-started) to configure CosmosKit.

## ⚛️ CosmJS Signers

If you want to get a cosmjs stargate or cosmwasm signer, [here are docs for our hooks](https://docs.cosmoskit.com/WalletManager/signing-client)

## 📦 Packages

| Name | Type | Description |
|----|----|----|
| [@cosmos-kit/core](packages/core)   | Core | Core CosmosKit functionality |
| [@cosmos-kit/react](packages/react) | UI | A wallet adapter for React with mobile WalletConnect support for the Cosmos ecosystem. |
| [@cosmos-kit/walletconnect](packages/walletconnect) | WalletConnect | Mobile WalletConnect support for the Cosmos ecosystem. |
## 📦 Wallets

| Name | Type | Description |
|----|----|----|
| [@cosmos-kit/react](packages/react) | UI | A wallet adapter for React with mobile WalletConnect support for the Cosmos ecosystem. |
| [@cosmos-kit/coin98-extension/](wallets/coin98-extension/) | Extension | Coin98 Web Extension Wallet integration. |
| [@cosmos-kit/coin98](wallets/coin98) | Root Wallet | Coin98 Wallet integration |
| [@cosmos-kit/cosmostation-extension/](wallets/cosmostation-extension/) | Extension | Cosmostation Web Extension Wallet integration. |
| [@cosmos-kit/cosmostation-mobile/](wallets/cosmostation-mobile/) | WalletConnect | Cosmostation Mobile Wallet integration. |
| [@cosmos-kit/cosmostation](wallets/cosmostation) | Root Wallet | Cosmostation Wallet integration. Use this if you want to integrate both extension & mobile wallet connect |
| [@cosmos-kit/keplr-extension/](wallets/keplr-extension/) | Extension | Keplr Web Extension Wallet integration. |
| [@cosmos-kit/keplr-mobile/](wallets/keplr-mobile/) | WalletConnect | Keplr Mobile Wallet integration. |
| [@cosmos-kit/keplr](wallets/keplr) | Root Wallet | Keplr Wallet integration. Use this if you want to integrate both extension & mobile wallet connect |
| [@cosmos-kit/leap](wallets/leap) | Root Wallet | Leap Wallet integration. Use this if you want to integrate the extension, no mobile wallet connect support yet. |
| [@cosmos-kit/omni](wallets/omni) | Root Wallet | Omni Wallet integration. Use this if you want to integrate the extension, no mobile wallet connect support yet. |
| [@cosmos-kit/station-extension](wallets/station-extension) | Extension | Station Wallet integration. Use this if you want to integrate the extension, no mobile wallet connect support yet. |
| [@cosmos-kit/station](wallets/station) | Root Wallet | Station Wallet integration. Use this if you want to integrate the extension, no mobile wallet connect support yet. |
| [@cosmos-kit/trust](wallets/trust) | Root Wallet | Trust Wallet integration. Use this if you want to integrate the extension, no mobile wallet connect support yet. |
| [@cosmos-kit/vectis](wallets/vectis) | Root Wallet | Vectis Wallet integration. Use this if you want to integrate the extension, no mobile wallet connect support yet. |
| [@cosmos-kit/xdefi-extension](wallets/xdefi-extension) | Root Wallet | XDEFI Wallet (Extension) integration. Use this if you want to integrate the extension, no mobile wallet connect support yet. |

### ✨ Example: [@cosmos-kit/example](packages/example)

An example Next.js project integrating `@cosmos-kit/react` wallet adapter.

## 🔌 Integrating Wallets

See our docs on [integrating your wallet](https://docs.cosmoskit.com/integrating-wallets)

## 🛠 Developing

Checkout the repository and bootstrap the yarn workspace:

```sh
# Clone the repo.
git clone https://github.com/cosmology-tech/cosmos-kit
cd cosmos-kit
yarn
yarn bootstrap
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

## Credits

Original work inspired by [cosmodal](https://github.com/chainapsis/cosmodal)

🛠 Built by Cosmology — if you like our tools, please consider delegating to [our validator ⚛️](https://cosmology.tech/validator)

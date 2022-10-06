# cosmos-kit

<p align="center" width="100%">
    <img height="90" src="https://user-images.githubusercontent.com/545047/190171432-5526db8f-9952-45ce-a745-bea4302f912b.svg" />
</p>

<p align="center" width="100%">
  <a href="https://github.com/cosmology-tech/cosmos-kit/actions/workflows/run-tests.yml">
    <img height="20" src="https://github.com/cosmology-tech/cosmos-kit/actions/workflows/run-tests.yml/badge.svg" />
  </a>
   <a href="https://github.com/cosmology-tech/cosmos-kit/blob/main/LICENSE"><img height="20" src="https://img.shields.io/badge/license-BSD%203--Clause%20Clear-blue.svg"></a>
   <a href="https://www.npmjs.com/package/@cosmos-kit/core"><img height="20" src="https://img.shields.io/github/package-json/v/cosmology-tech/cosmos-kit?filename=packages%2Fcore%2Fpackage.json"></a>
</p>

Cosmos Kit is a wallet adapter for developers to build apps that quickly and easily interact with Cosmos blockchains and wallets.

## Quickstart

Get started quickly by using [create-cosmos-app](https://github.com/cosmology-tech/create-cosmos-app) to help you build high-quality Cosmos apps fast!

## Configuration

Check out [our docs here](packages/react/README.md) to configure Cosmos Kit.

## CosmJS Signers

If you want to get a cosmjs stargate or cosmwasm signer, [here are docs for our hooks](https://github.com/cosmology-tech/cosmos-kit/blob/main/packages/react/README.md#2-signing-clients)

## Packages

#### [@cosmos-kit/react](packages/react)

A wallet adapter for react with mobile WalletConnect support for the Cosmos ecosystem.

#### [@cosmos-kit/keplr](packages/keplr)

Keplr Wallet integration with Mobile support.

#### [@cosmos-kit/example](packages/example)

An example Next.js project integrating `@cosmos-kit/react` wallet adapter.

## Integrating Wallets

See our docs on [integrating your wallet](https://github.com/cosmology-tech/cosmos-kit/blob/main/INTEGRATING-WALLETS.md)

## Developing

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

# cosmos-wallet

<p align="center" width="100%">
    <img height="90" src="https://user-images.githubusercontent.com/545047/184277736-69fef40f-1991-4c0e-b979-da125cf7fd8f.svg" />
</p>

<p align="center" width="100%">
  <a href="https://github.com/cosmology-tech/cosmos-wallet/actions/workflows/run-tests.yml">
    <img height="20" src="https://github.com/cosmology-tech/cosmos-wallet/actions/workflows/run-tests.yml/badge.svg" />
  </a>
   <a href="https://github.com/cosmology-tech/cosmos-wallet/blob/main/LICENSE-MIT"><img height="20" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
   <a href="https://github.com/cosmology-tech/cosmos-wallet/blob/main/LICENSE-Apache"><img height="20" src="https://img.shields.io/badge/license-Apache-blue.svg"></a>
   <a href="https://www.npmjs.com/package/@cosmos-wallet/core"><img height="20" src="https://img.shields.io/github/package-json/v/cosmology-tech/cosmos-wallet?filename=packages%2Fcore%2Fpackage.json"></a>
</p>

A wallet adapter for react with mobile WalletConnect support for the Cosmos
ecosystem.

## Getting Started

#### [@cosmos-wallet/react](packages/react/README.md)

A wallet adapter for react with mobile WalletConnect support for the Cosmos ecosystem.

#### [@cosmos-wallet/example](packages/example/README.md)

An example Next.js project integrating `@cosmos-wallet/react` wallet adapter.

## Developing

Checkout the repository and bootstrap the yarn workspace:

```sh
# Clone the repo.
git clone https://github.com/cosmology-tech/cosmos-wallet
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

Original work inspired by [cosmodal](https://github.com/chainapsis/cosmodal).

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

A wallet adapter for react with mobile WalletConnect support for the Cosmos
ecosystem

Cosmos Kit is used in [create-cosmos-app](https://github.com/cosmology-tech/create-cosmos-app) to help you build high-quality Cosmos apps fast!

## Getting Started

#### [@cosmos-kit/react](packages/react/README.md)

A wallet adapter for react with mobile WalletConnect support for the Cosmos ecosystem.

#### [@cosmos-kit/example](packages/example/README.md)

An example Next.js project integrating `@cosmos-kit/react` wallet adapter.

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

Original work inspired by [cosmodal](https://github.com/chainapsis/cosmodal).

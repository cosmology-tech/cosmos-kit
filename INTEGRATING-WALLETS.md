# CosmosKit Wallet Integrations

## requirements

* having an `offlineSigner`

## implementation

## 1 make a PR to add your wallet adapter

* make PR to [`cosmos-kit/packages/<your-wallet>`](https://github.com/cosmology-tech/cosmos-kit/tree/main/packages)
* name the package `@cosmos-kit/<your-wallet>`

For reference, see the [keplr cosmos-kit package](https://github.com/cosmology-tech/cosmos-kit/tree/main/packages/keplr) for integrating wallet.

### details

### main wallet class

This is the class for when the wallet is not connected, and presents information to the user, and has methods to connect to the wallet.

* add your [images and wallet info](https://github.com/cosmology-tech/cosmos-kit/blob/aa16c2c4fc3d8245e2fa0d2624a6f2ff5ab73c2a/packages/keplr/src/extension/registry.ts) to a registry
* the design may require a round image right now, but we can update that if it becomes an issue
* implement a class that [extends the `MainWalletBase`](https://github.com/cosmology-tech/cosmos-kit/blob/aa16c2c4fc3d8245e2fa0d2624a6f2ff5ab73c2a/packages/keplr/src/extension/main-wallet.ts#L11) abstract class
* load the registry data as [defaults to the wallet class](https://github.com/cosmology-tech/cosmos-kit/blob/aa16c2c4fc3d8245e2fa0d2624a6f2ff5ab73c2a/packages/keplr/src/extension/main-wallet.ts#L20)
* if you have them, [add your wallet's preferred endpoints](https://github.com/cosmology-tech/cosmos-kit/blob/aa16c2c4fc3d8245e2fa0d2624a6f2ff5ab73c2a/packages/keplr/src/extension/main-wallet.ts#L31-L48)

### chain wallet class

This is the class for when the wallet is connected 

* implement a class that [extends the `ChainWalletBase`](https://github.com/cosmology-tech/cosmos-kit/blob/aa16c2c4fc3d8245e2fa0d2624a6f2ff5ab73c2a/packages/keplr/src/extension/chain-wallet.ts#L8) abstract class
* set `address`, `username`, and `offlineSigner` [in the `update()` method](https://github.com/cosmology-tech/cosmos-kit/blob/aa16c2c4fc3d8245e2fa0d2624a6f2ff5ab73c2a/packages/keplr/src/extension/chain-wallet.ts#L50-L56)

We use [the chain-registry](https://github.com/cosmos/chain-registry) as our data source, with the npm module as a way to convert data to your wallet. Here is the [experimental suggest chain](https://github.com/cosmology-tech/cosmos-kit/blob/aa16c2c4fc3d8245e2fa0d2624a6f2ff5ab73c2a/packages/keplr/src/extension/chain-wallet.ts#L46) for Keplr, and you can see that we convert the data from `chain-registry` into Keplr's data structure with the [`chainRegistryChainToKeplr` function](https://github.com/cosmology-tech/cosmos-kit/blob/95d4f1346ee9d577cb18415127aaba84cca6b1a4/packages/keplr/src/extension/chain-wallet.ts#L33-L35).  

### wallet client

This is your client. It probably lives on `window`. However, it is best if we abstract that for interoperability:

* don't use `window` directly, [write a async `get<YourWallet>FromExtension` method](https://github.com/cosmology-tech/cosmos-kit/blob/aa16c2c4fc3d8245e2fa0d2624a6f2ff5ab73c2a/packages/keplr/src/extension/utils.ts#L5-L10) to return your client

### exporting the wallet

This is how we can read your wallet into the provider.

* export a [`wallets` object from the root](https://github.com/cosmology-tech/cosmos-kit/blob/aa16c2c4fc3d8245e2fa0d2624a6f2ff5ab73c2a/packages/keplr/src/keplr.ts#L7)

## 2 make a PR to convert to your wallet data 

* make PR to [`chain-registry/packages/<your-wallet>`](https://github.com/cosmology-tech/chain-registry/tree/main/packages)
* name the package `@chain-registry/<your-wallet>`

For reference, see the [keplr chain-registry package](https://github.com/cosmology-tech/chain-registry/tree/main/packages/keplr) for integrating your wallet data structure


### details

For reference, you can see how `chainRegistryChainToKeplr` takes `Chain` and `AssetList[]` as args from the `@chain-registry/types` repo. Optionally you can provide methods to set preferred endpoints/explorers. [Here is an example](https://github.com/cosmology-tech/chain-registry/blob/40709e28e89fe7346017f1daddd9195b33a273df/packages/keplr/src/index.ts#L25): 

```ts
export const chainRegistryChainToKeplr = (
  chain: Chain,
  assets: AssetList[],
  options: {
    getRpcEndpoint: (chain: Chain) => string;
    getRestEndpoint: (chain: Chain) => string;
    getExplorer: (chain: Chain) => string;
  } = {
    getRpcEndpoint: getRpc,
    getRestEndpoint: getRest,
    getExplorer: getExplr
  }
): ChainInfo;
```




# CosmosKit Wallet Integrations

## requirements

* having an `offlineSigner`

## implementation

## 1 make a PR to add your wallet adapter

* make PR to [`cosmos-kit/packages/<your-wallet>`](https://github.com/cosmology-tech/cosmos-kit/tree/main/packages)
* name the package `@cosmos-kit/<your-wallet>`

For reference, see the [keplr cosmos-kit package](https://github.com/cosmology-tech/cosmos-kit/tree/main/packages/keplr) for integrating wallet.

### details

* set `address`, `username`, and `offlineSigner` in a class that extends `ChainWalletBase`
* implement the abstract class and add your images and wallet info
* the design may require a round image right now, but we can update that if it becomes an issue

## 2 make a PR to convert to your wallet data 

* make PR to [`chain-registry/packages/<your-wallet>`](https://github.com/cosmology-tech/chain-registry/tree/main/packages)
* name the package `@chain-registry/<your-wallet>`

For reference, see the [keplr chain-registry package](https://github.com/cosmology-tech/chain-registry/tree/main/packages/keplr) for integrating your wallet data structure


### details

We use [the chain-registry](https://github.com/cosmos/chain-registry) as our data source, with the npm module as a way to convert data to your wallet. Here is the [experimental suggest chain](https://github.com/cosmology-tech/cosmos-kit/blob/aa16c2c4fc3d8245e2fa0d2624a6f2ff5ab73c2a/packages/keplr/src/extension/chain-wallet.ts#L46) for keplr, and you can see that we convert the data from chain-registry into keplr's data structure with the [`chainRegistryChainToKeplr` function](https://github.com/cosmology-tech/cosmos-kit/blob/main/packages/keplr/src/extension/chain-wallet.ts#L33-L35).  

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




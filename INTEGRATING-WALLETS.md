# CosmosKit Wallet Integrations

<p align="center" width="100%">
    <img height="90" src="https://user-images.githubusercontent.com/545047/190171432-5526db8f-9952-45ce-a745-bea4302f912b.svg" />
</p>

## Requirements

- having an `offlineSigner` for the provider
- having either an `experimentalSuggestChain` or similar method to suggest chains to your wallet
- a function `chainRegistryChainTo<YourWallet>` to convert [`chain-registry`](https://github.com/cosmos/chain-registry) data format to your wallet's data format

## 1 Make a PR to add your wallet adapter

- make PR to [`cosmos-kit/packages/<your-wallet>`](https://github.com/cosmology-tech/cosmos-kit/tree/main/packages)
- name the package `@cosmos-kit/<your-wallet>`

For reference, see the [keplr cosmos-kit package](https://github.com/cosmology-tech/cosmos-kit/tree/main/packages/keplr) for integrating wallet.

### 📝 Main wallet class

This is the class for when the wallet is not connected, and presents information to the user, and has methods to connect to the wallet.

- add your [images and wallet info](https://github.com/cosmology-tech/cosmos-kit/blob/aa16c2c4fc3d8245e2fa0d2624a6f2ff5ab73c2a/packages/keplr/src/extension/registry.ts) to a registry
- the design may require a round image right now, but we can update that if it becomes an issue
- implement a class that [extends the `MainWalletBase`](https://github.com/cosmology-tech/cosmos-kit/blob/aa16c2c4fc3d8245e2fa0d2624a6f2ff5ab73c2a/packages/keplr/src/extension/main-wallet.ts#L11) abstract class
- load the registry data as [defaults to the wallet class](https://github.com/cosmology-tech/cosmos-kit/blob/aa16c2c4fc3d8245e2fa0d2624a6f2ff5ab73c2a/packages/keplr/src/extension/main-wallet.ts#L20)
- if you have them, [add your wallet's preferred endpoints](https://github.com/cosmology-tech/cosmos-kit/blob/aa16c2c4fc3d8245e2fa0d2624a6f2ff5ab73c2a/packages/keplr/src/config.ts#L3) and then [use them](https://github.com/cosmology-tech/cosmos-kit/blob/aa16c2c4fc3d8245e2fa0d2624a6f2ff5ab73c2a/packages/keplr/src/extension/main-wallet.ts#L31-L48) (do NOT use other wallet's endpoints, please bring your own, or let cosmos-kit use chain-registry as the default)

### ⚡️ Chain wallet class

This is the class for when the wallet is connected

- implement a class that [extends the `ChainWalletBase`](https://github.com/cosmology-tech/cosmos-kit/blob/aa16c2c4fc3d8245e2fa0d2624a6f2ff5ab73c2a/packages/keplr/src/extension/chain-wallet.ts#L8) abstract class
- set `address`, `username`, and `offlineSigner` [in the `update()` method](https://github.com/cosmology-tech/cosmos-kit/blob/aa16c2c4fc3d8245e2fa0d2624a6f2ff5ab73c2a/packages/keplr/src/extension/chain-wallet.ts#L50-L56)
- convert the chain info from `chain-registry` format using your [`chainRegistryChainTo<YourWallet>` function](https://github.com/cosmology-tech/cosmos-kit/blob/95d4f1346ee9d577cb18415127aaba84cca6b1a4/packages/keplr/src/extension/chain-wallet.ts#L33-L35) and [suggest your chain info to your wallet](https://github.com/cosmology-tech/cosmos-kit/blob/aa16c2c4fc3d8245e2fa0d2624a6f2ff5ab73c2a/packages/keplr/src/extension/chain-wallet.ts#L46)

### 💴 Wallet client

This is your client. It probably lives on `window`, e.g., `window.keplr`. However, it is best if we abstract that for interoperability:

- don't use `window` directly, [write a async `get<YourWallet>FromExtension` method](https://github.com/cosmology-tech/cosmos-kit/blob/aa16c2c4fc3d8245e2fa0d2624a6f2ff5ab73c2a/packages/keplr/src/extension/utils.ts#L5-L10) to return your client
- make sure to protect your call to `window` with a return [`if (typeof window === 'undefined')`](https://github.com/cosmology-tech/cosmos-kit/blob/aa16c2c4fc3d8245e2fa0d2624a6f2ff5ab73c2a/packages/keplr/src/extension/utils.ts#L8-L10) so applications can leverage server side rendering w/o issues.

### 🔌 Exporting the wallet

This is how we can read your wallet into the provider.

- export a [`wallets` object from the root](https://github.com/cosmology-tech/cosmos-kit/blob/aa16c2c4fc3d8245e2fa0d2624a6f2ff5ab73c2a/packages/keplr/src/keplr.ts#L7)

## 2 Convert to your wallet data

If you use the same data structure as Keplr, you can use the Keplr conversion function.

The interface should be as follows:

```ts
import { Chain, AssetList } from '@chain-registry/types';
export const chainRegistryChainToYourWallet = (
  chain: Chain,
  assets: AssetList[]
): YourWalletChainInfo;
```

You can inline the function in this repo, however, it could be useful to publish to the chain-registry for other wallet adapters. Optionally, you can publish this method to `@chain-registry/<your-wallet>`.

- optoinally, make PR to [`chain-registry/packages/<your-wallet>`](https://github.com/cosmology-tech/chain-registry/tree/main/packages)
- name the package `@chain-registry/<your-wallet>`

For reference, see the [keplr chain-registry package](https://github.com/cosmology-tech/chain-registry/tree/main/packages/keplr) for integrating your [wallet data structure](https://github.com/cosmology-tech/chain-registry/blob/40709e28e89fe7346017f1daddd9195b33a273df/packages/keplr/src/index.ts#L25)

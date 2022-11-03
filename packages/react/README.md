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

Cosmos Kit is a wallet adapter for developers to build apps that quickly and easily interact with Cosmos blockchains and wallets.

@cosmos-kit/react is the React integration for Cosmos Kit.

## Documentation

[docs.cosmoskit.com](https://docs.cosmoskit.com)

## Installation

```sh
yarn add @cosmos-kit/react @cosmos-kit/core @cosmos-kit/keplr chain-registry
```

## Provider

First, add the `WalletProvider` to your app, and include the supported chains and supported wallets:

```tsx
import * as React from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import { WalletProvider } from '@cosmos-kit/react';
import { chains, assets } from 'chain-registry';
import { wallets } from '@cosmos-kit/keplr';

function CosmosApp() {
  return (
    <ChakraProvider theme={defaultTheme}>
      <WalletProvider
        chains={chains} // supported chains
        assetLists={assets} // supported asset lists
        wallets={wallets} // supported wallets
      >
        <YourWalletRelatedComponents />
      </WalletProvider>
    </ChakraProvider>
  );
}
```

Get wallet properties and functions using the `useWallet` hook:

```tsx
import * as React from 'react';

import { useWallet } from "@cosmos-kit/react";

function Component ({ chainName }: { chainName?: string }) => {
    const walletManager = useWallet();

    // Get wallet properties
    const {
        currentChainName,
        currentWalletName,
        walletStatus,
        username,
        address,
        message,
      } = walletManager;

    // Get wallet functions
    const {
        connect,
        disconnect,
        openView,
        setCurrentChain,
    } = walletManager;

    // if `chainName` in component props, `setCurrentChain` in `useEffect`
    React.useEffect(() => {
        setCurrentChain(chainName);
    }, [chainName]);
}
```

## Signing Clients

There two signing clients available via `walletManager` functions: `getSigningStargateClient()` and `getSigningCosmWasmClient()`.

Using signing client in react component:

```tsx
import * as React from 'react';
import { cosmos } from 'interchain';
import { StdFee } from '@cosmjs/amino';
import { useWallet } from "@cosmos-kit/react";

function Component () => {
    const walletManager = useWallet();
    const {
        getSigningStargateClient,
        getSigningCosmWasmClient,
        address,
      } = walletManager;

    const sendTokens = async () => {
      const stargateClient = await getSigningStargateClient();
      if (!stargateClient || !address) {
          console.error('stargateClient undefined or address undefined.')
          return;
      }

      const { send } = cosmos.bank.v1beta1.MessageComposer.withTypeUrl;

      const msg = send({
        amount: [ { denom: 'uatom', amount: '1000' } ],
        toAddress: address, fromAddress: address
      });

      const fee: StdFee = { amount: [ { denom: 'uatom', amount: '864' } ], gas: '86364' };

      await stargateClient.signAndBroadcast(address, [msg], fee, memo);
    }
}
```

### Customized signing client options

The default options are `undefined`. You can provide your own options in `WalletProvider`.

```ts
import * as React from 'react';

import { Chain } from '@chain-registry/types';
import { chains } from 'chain-registry';
import { GasPrice } from '@cosmjs/stargate';
import { getSigningCosmosClientOptions } from 'interchain';
import { SignerOptions } from '@cosmos-kit/core';
import { WalletProvider } from '@cosmos-kit/react';
import { wallets } from '@cosmos-kit/config';

// construct signer options
const signerOptions: SignerOptions = {
  stargate: (chain: Chain) => {
    // return corresponding stargate options or undefined
    return getSigningCosmosClientOptions();
  },
  cosmwasm: (chain: Chain) => {
    // return corresponding cosmwasm options or undefined
    switch (chain.chain_name) {
      case 'osmosis':
        return {
          gasPrice: GasPrice.fromString('0.0025uosmo'),
        };
      case 'juno':
        return {
          gasPrice: GasPrice.fromString('0.0025ujuno'),
        };
    }
  },
};

function CosmosApp() {
  return (
    <WalletProvider
      chains={chains}
      wallets={wallets}
      signerOptions={signerOptions} // Provide signerOptions
    >
      <YourWalletRelatedComponents />
    </WalletProvider>
  );
}
```

The `SignerOptions` object has `stargate` and `cosmwasm` properties which are functions that return client options:

```ts
// in '@cosmos-kit/core'
import { SigningStargateClientOptions } from '@cosmjs/stargate';
import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';

export interface SignerOptions {
  stargate?: (chain: Chain) => SigningStargateClientOptions | undefined;
  cosmwasm?: (chain: Chain) => SigningCosmWasmClientOptions | undefined;
}
```

### Customized Modal

You can bring your own UI. The `WalletProvider` provides a default modal for connection in `@cosmos-kit/react`.

```ts
import { DefaultModal } from '@cosmos-kit/react';
```

To define your own modal, you can input you modal component in `WalletProvider` props.

Required properties in your modal component:

```ts
import { WalletModalProps } from '@cosmos-kit/core';

// in `@cosmos-kit/core`
export interface WalletModalProps {
  isOpen: boolean;
  setOpen: Dispatch<boolean>;
}
```

A simple example to define your own modal:

```tsx
import * as React from 'react';

import { WalletProvider, useWallet } from '@cosmos-kit/react';

// Define Modal Component
const MyModal = ({ isOpen, setOpen }: WalletModalProps) => {
  const walletManager = useWallet();

  function onCloseModal() {
    setOpen(false);
  }

  function onWalletClicked(name: string) {
    return async () => {
      console.info('Connecting ' + name);
      walletManager.setCurrentWallet(name);
      await walletManager.connect();
    };
  }

  return (
    <Modal isOpen={open} onClose={onCloseModal}>
      <ModalContent>
        <ModalHeader>Choose Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {walletManager.wallets.map(({ name, prettyName }) => (
            <Button
              key={name}
              colorScheme="blue"
              variant="ghost"
              onClick={onWalletClicked(name)}
            >
              {prettyName}
            </Button>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

function CosmosApp() {
  return (
    <WalletProvider
      chains={chains}
      wallets={wallets}
      walletModal={MyModal} // Provide walletModal
    >
      <YourWalletRelatedComponents />
    </WalletProvider>
  );
}
```

### Customized Wallet Info

The simplest way to import wallets in `WalletProvider` is `import { wallets } from '@cosmos-kit/keplr';`. `wallets` is of type `Wallet[]`, and the `Wallet` here is from `import { Wallet } from '@cosmos-kit/core';`.

```ts
export interface Wallet {
  name: WalletName;
  prettyName: string;
  mode: WalletMode;
  downloads?: {
    default: string;
    desktop?: Icon[];
    tablet?: Icon[];
    mobile?: Icon[];
  };
  logo?: string;
  qrCodeLink?: string;
}
```

To define your own wallet info, such as icon, app name, as well as other props, you can construct wallets as follows.

```ts
import { KeplrExtensionWallet, KeplrMobileWallet } from '@cosmos-kit/keplr';

const keplrExtensionInfo: Wallet = {...};
const keplrMobileInfo: Wallet = {...};

const keplrExtension = new KeplrExtensionWallet(keplrExtensionInfo);
const KeplrMobile = new KeplrMobileWallet(keplrMobileInfo);

export const wallets = [keplrExtension, KeplrMobile];
```

The default value of `keplrExtensionInfo` and `keplrMobileInfo` can be seen from `import { keplrExtensionInfo, keplrMobileInfo } from '@cosmos-kit/keplr';`.

### Options in `WalletProvider`

#### `endpointOptions`

Define preferred endpoints for each chain.

```ts
export type ChainName = string;

export interface Endpoints {
  rpc?: string[];
  rest?: string[];
}

export type EndpointOptions = Record<ChainName, Endpoints>;
```

e.g.

```tsx
<WalletProvider
  ...
  endpointOptions={{
    osmosis: {
      rpc: ['http://test.com']
    }
  }}
>
```

#### `viewOptions`

Define automation for view. `Optional`

```ts
export interface ViewOptions {
  /**
   * if alwaysOpenView === true, always open view when `connect` or `disconnect` is called
   * if alwaysOpenView === false, only open view when necessary. e.g. current wallet is not defined, need to choose wallet in modal.
  */
  alwaysOpenView?: boolean;
  closeViewWhenWalletIsConnected?: boolean;
  closeViewWhenWalletIsDisconnected?: boolean;
  closeViewWhenWalletIsRejected?: boolean;
}

// default value
const viewOptions: ViewOptions = {
  alwaysOpenView: false,
  closeViewWhenWalletIsConnected: false,
  closeViewWhenWalletIsDisconnected: true,
  closeViewWhenWalletIsRejected: false,
};
```

#### `storageOptions`

Define local storage attributes. `Optional`

storage key: `walletManager`

storage value attributes:
- `currentWalletName`
- `currentChainName`

```ts
export interface StorageOptions {
  disabled?: boolean;
  duration?: number; // ms
  clearOnTabClose?: boolean;
}

// default value
const storageOptions: StorageOptions = {
  disabled: false,
  duration: 1800000, // half an hour
  clearOnTabClose: false
};
```

#### `sessionOptions`

Define connection session options. `Optional`

```ts
export interface SessionOptions {
  duration?: number; // ms
  killOnTabClose?: boolean;
}

// default value
  sessionOptions: SessionOptions = {
    duration: 1800000, // half an hour
    killOnTabClose: false,
  };
```

## Credits

🛠 Built by Cosmology — if you like our tools, please consider delegating to [our validator ⚛️](https://cosmology.tech/validator)

Code built with the help of these related projects:

- [create-cosmos-app](https://github.com/cosmology/create-cosmos-app) Set up a modern Cosmos app by running one command ⚛️
- [chain-registry](https://github.com/cosmology/chain-registry) an npm module for the official Cosmos chain-registry

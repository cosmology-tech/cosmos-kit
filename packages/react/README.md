# cosmos-kit

<p align="center" width="100%">
    <img height="90" src="https://user-images.githubusercontent.com/545047/190171432-5526db8f-9952-45ce-a745-bea4302f912b.svg" />
</p>

<p align="center" width="100%">
  <a href="https://github.com/cosmology-tech/cosmos-kit/actions/workflows/run-tests.yml">
    <img height="20" src="https://github.com/cosmology-tech/cosmos-kit/actions/workflows/run-tests.yml/badge.svg" />
  </a>
   <a href="https://github.com/cosmology-tech/cosmos-kit/blob/main/packages/core/LICENSE"><img height="20" src="https://img.shields.io/badge/license-BSD%203--Clause%20Clear-blue.svg"></a>
   <a href="https://www.npmjs.com/package/cosmos-kit"><img height="20" src="https://img.shields.io/github/package-json/v/cosmology-tech/cosmos-kit?filename=packages%2Fcosmos-kit%2Fpackage.json"></a>
</p>

A wallet adapter for react with mobile WalletConnect support for the Cosmos
ecosystem.

cosmos-kit wallet connector

## Getting Start

## 1. Installation

```cli
npm i @cosmos-kit/react @cosmos-kit/config @cosmos-kit/core
```
```cli
yarn add @cosmos-kit/react @cosmos-kit/config @cosmos-kit/core
```

`types` are included in `@cosmos-kit/core`

## 2. Connection
### 2.1 Quick Start

`Provider`

```tsx
import * as React from 'react';

// 1. Import `ChakraProvider` component
import { WalletProvider } from '@cosmos-kit/react';

function WalletApp() {
  // 2. Wrap `WalletProvider` at the top level of your wallet related components.
  return (
    <WalletProvider>
      <YourWalletRelatedComponents />
    </WalletProvider>
  )
}
```

`Hook`

```tsx
import * as React from 'react';

// 1. Import `useWallet` hook
import { useWallet } from "@cosmos-kit/react";

function Component ({ chainName }: { chainName?: string }) => {
    const walletManager = useWallet();

    // 2. Get wallet properties
    const {
        currentChainName, 
        currentWalletName, 
        walletStatus, 
        username, 
        address, 
        message,
      } = walletManager;

    // 3. Get wallet functions
    const { 
        connect, 
        disconnect, 
        openView,
        setCurrentChain,
    } = walletManager;

    // 4. if `chainName` in component props, `setCurrentChain` in `useEffect`
    React.useEffect(() => {
        setCurrentChain(chainName);
    }, [chainName]);
}
```

### 2.2 Customized chains and wallets

By default `WalletProvider` support all wallets and chains from `@cosmos-kit/config`.

```ts
import { walletRecords, chainRecords } from '@cosmos-kit/config';
```

To modify supported wallets and chains, you can construct your own `walletManager` instance with customized `chainRecords` and `walletRecords` when wrapping `WalletProvider`.

```tsx
import * as React from 'react';

import { WalletProvider } from '@cosmos-kit/react';
import { WalletManager } from '@cosmos-kit/core';
import { ChainRecord, WalletRecord } from '@cosmos-kit/core';

// 1. Construct `walletManager` instance with `chainRecords` and `walletRecords`
const chainRecords: ChainRecord[] = ...
const walletRecords: WalletRecord[] = ...
const walletManager = new WalletManager(chainRecords, walletRecords);

function WalletApp() {
  return (
    // 2. Input `walletManager` as value of prop `walletManager` in `WalletProvider`
    <WalletProvider 
        walletManager={walletManager}
    >
      <YourWalletRelatedComponents />
    </WalletProvider>
  )
}
```

### 2.3 Customized modal

`WalletProvider` provide a default modal for connection in `@cosmos-kit/react`.

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

// 1. Define Modal Component
const MyModal = ({ isOpen, setOpen }: WalletModalProps) => {
  const walletManager = useWallet();

  function onCloseModal () {
    setOpen(false);
  };

  function onWalletClicked(name: string) {
    return async () => {
      console.info('Connecting ' + name);
      walletManager.setCurrentWallet(name);
      await walletManager.connect();
    }
  }

  return (
    <Modal isOpen={open} onClose={onCloseModal}>
      <ModalContent>
        <ModalHeader>Choose Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {walletManager.wallets.map(({ name, prettyName }) => (
            <Button key={name} colorScheme='blue' variant='ghost' onClick={onWalletClicked(name)}>
              {prettyName}
            </Button>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

function WalletApp() {
  return (
    // 2. Input `MyModal` as value of prop `walletModal` in `WalletProvider`
    <WalletProvider 
        walletModal={MyModal}
    >
      <YourWalletRelatedComponents />
    </WalletProvider>
  )
}
```

## 3. Signing Client

There two signing clients available in `walletManager`: `stargateClient` and `cosmwasmClient`.

Using signing client in react component:

```tsx
import * as React from 'react';
import { useWallet } from "@cosmos-kit/react";

function Component () => {
    const walletManager = useWallet();
    const {
        getStargateClient,
        getCosmWasmClient,
        address,
      } = walletManager;

    const onSignAndBroadcast = async () => {
      const _stargateClient = await getStargateClient();
      if (!_stargateClient || !address) {
          console.error('stargateClient undefined or address undefined.')
          return;
      }

      await _stargateClient.signAndBroadcast(address, voteMessages, fee, memo);
    }
}
```

### 3.1 Customized signing client options

The default options are `undefined`. To define your own signing client options in each chain, your can modify `options` in customized `chainRecords`.

```ts
// in '@cosmos-kit/core'
import { SigningStargateClientOptions } from '@cosmjs/stargate';
import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';

export interface ChainRecord extends Info<ChainName> {
  registry?: Chain;
  options?: {
    stargate?: (chainRecord: Chain) => SigningStargateClientOptions | undefined;
    cosmwasm?: (chainRecord: Chain) => SigningCosmWasmClientOptions | undefined;
  }
}
```

[How to customize chainRecords](#22-customized-chains-and-wallets)

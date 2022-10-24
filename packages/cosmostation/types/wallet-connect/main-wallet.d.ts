/// <reference types="node" />
import {
  Callbacks,
  ChainRecord,
  SessionOptions,
  Wallet,
} from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { CosmostationMobile } from './types';
import WalletConnect from '@walletconnect/client';
import EventEmitter from 'events';
import { ChainCosmostationMobile } from './chain-wallet';
import { CosmostationMobileData } from './types';
export declare class CosmostationMobileWallet extends MainWalletBase<
  CosmostationMobile,
  CosmostationMobileData,
  ChainCosmostationMobile
> {
  connector: WalletConnect;
  emitter: EventEmitter;
  constructor(walletInfo?: Wallet, chains?: ChainRecord[]);
  get isInSession(): boolean;
  get qrUri(): string;
  setChains(chains: ChainRecord[]): void;
  connect(
    sessionOptions?: SessionOptions,
    callbacks?: Callbacks
  ): Promise<void>;
  fetchClient(): Promise<CosmostationMobile>;
  update(callbacks?: Callbacks): Promise<void>;
  disconnect(callbacks?: Callbacks): Promise<void>;
}

/// <reference types="node" />
import {
  Callbacks,
  ChainRecord,
  ChainWalletBase,
  SessionOptions,
  Wallet,
} from '@cosmos-kit/core';
import { CosmostationMobile } from './types';
import WalletConnect from '@walletconnect/client';
import EventEmitter from 'events';
import { ChainCosmostationMobileData } from './types';
export declare class ChainCosmostationMobile extends ChainWalletBase<
  CosmostationMobile,
  ChainCosmostationMobileData
> {
  private _emitter;
  constructor(
    walletInfo: Wallet,
    chainInfo: ChainRecord,
    client: CosmostationMobile,
    emitter: EventEmitter
  );
  get connector(): WalletConnect;
  get isInSession(): boolean;
  get username(): string | undefined;
  get qrUri(): string;
  connect(
    sessionOptions?: SessionOptions,
    callbacks?: Callbacks
  ): Promise<void>;
  fetchClient(): Promise<CosmostationMobile>;
  update(callbacks?: Callbacks): Promise<void>;
  disconnect(callbacks?: Callbacks): Promise<void>;
}

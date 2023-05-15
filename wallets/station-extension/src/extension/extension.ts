import { Extension, Tx, ExtensionOptions } from '@terra-money/feather.js';
import { NetworkInfo, Addresses, Pubkeys, ChainId } from './types';

type ConnectResponse = {
  address: string;
  addresses: Addresses;
  pubkey: Pubkeys;
};

type InfoResponse = Record<ChainId, NetworkInfo>;

type SignResponse = {
  payload: {
    result: Tx.Data;
  };
};

function isValidResult({ error, ...payload }: any): boolean {
  if (typeof payload.success !== 'boolean') {
    return false;
  } else if (
    typeof payload.result === 'undefined' &&
    typeof error === 'undefined'
  ) {
    return false;
  }
  return true;
}

export class StationExtension {
  private extension: Extension;
  identifier = 'station';
  _inTransactionProgress = false;

  // resolvers
  connectResolvers = new Set<[(data: any) => void, (error: any) => void]>();
  infoResolvers = new Set<[(data: any) => void, (error: any) => void]>();
  pubkeyResolvers = new Set<[(data: any) => void, (error: any) => void]>();
  signResolvers = new Map<
    number,
    [(data: any) => void, (error: any) => void]
  >();

  constructor() {}

  get isAvailable(): boolean {
    return this.extension.isAvailable;
  }

  async init(): Promise<void> {
    this.extension = new Extension();

    this.onResponse();
  }

  async connect() {
    return new Promise<ConnectResponse>((...resolver) => {
      this.connectResolvers.add(resolver);
      this.extension.connect();
    });
  }

  async info() {
    return new Promise<InfoResponse>((...resolver) => {
      this.infoResolvers.add(resolver);
      this.extension.info();
    });
  }

  async getPubKey() {
    return new Promise<ConnectResponse>((...resolver) => {
      this.pubkeyResolvers.add(resolver);
      this.extension.pubkey();
    });
  }

  disconnect() {
    this.connectResolvers.clear();
    this.infoResolvers.clear();
    this.signResolvers.clear();
  }

  async sign({ purgeQueue = true, ...data }: ExtensionOptions) {
    return new Promise<SignResponse>((...resolver) => {
      this._inTransactionProgress = true;

      const id = this.extension.sign({
        ...data,
        purgeQueue,
      });

      this.signResolvers.set(id, resolver);

      setTimeout(() => {
        if (this.signResolvers.has(id)) {
          this.signResolvers.delete(id);

          if (this.signResolvers.size === 0) {
            this._inTransactionProgress = false;
          }
        }
      }, 1000 * 120);
    });
  }

  private onResponse() {
    this.extension.on('onConnect', (result) => {
      if (!result) return;
      const { error, ...payload } = result;

      for (const [resolve, reject] of this.connectResolvers) {
        if (error) {
          reject(error);
        } else {
          resolve(payload);
        }
      }

      this.connectResolvers.clear();
    });

    this.extension.on('onGetPubkey', (result) => {
      if (!result) return;
      const { error, ...payload } = result;

      for (const [resolve, reject] of this.pubkeyResolvers) {
        if (error) {
          reject(error);
        } else {
          resolve(payload);
        }
      }

      this.pubkeyResolvers.clear();
    });

    this.extension.on('onInterchainInfo', (result) => {
      if (!result) return;
      const { error, ...payload } = result;

      for (const [resolve, reject] of this.infoResolvers) {
        if (error) {
          reject(error);
        } else {
          resolve(payload);
        }
      }

      this.infoResolvers.clear();
    });

    this.extension.on('onSign', (result) => {
      if (!result || !isValidResult(result)) {
        return;
      }

      const { error, ...payload } = result;

      if (this.signResolvers.has(payload.id)) {
        const [resolve, reject] = this.signResolvers.get(payload.id)!;

        if (!payload.success) {
          reject(error);
        } else if (resolve) {
          resolve({ name: 'onSign', payload });
        }

        this.signResolvers.delete(payload.id);

        if (this.signResolvers.size === 0) {
          this._inTransactionProgress = false;
        }
      }
    });
  }
}

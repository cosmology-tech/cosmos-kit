/* eslint-disable @typescript-eslint/no-unused-vars */
import { Algo, StdSignDoc } from '@cosmjs/amino';
import {
  ChainRecord,
  DirectSignDoc,
  ExtendedHttpEndpoint,
  SignOptions,
  SignType,
  WalletClient,
} from '@cosmos-kit/core';
import {
  Extension,
  ExtensionOptions,
  CreateTxOptions,
} from '@terra-money/terra.js';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import EventEmitter from 'events';
import { Addresses } from './types';

export class TerrastationClient implements WalletClient {
  readonly client: Extension;
  private addresses?: Addresses;
  private emitter: EventEmitter;

  constructor(client: Extension) {
    this.emitter = new EventEmitter();
    this.client = client;
    this.client.on('onConnect', (result) => {
      if (!result) return;
      const { error, ...payload } = result;
      if (error) {
        throw new Error(error);
      } else {
        this.addresses = payload.addresses;
      }
      this.emitter.emit('connect');
    });
  }

  private getPromiseFromEvent(eventName: string) {
    return new Promise((resolve) => {
      const listener = () => {
        this.emitter.off(eventName, listener);
        resolve(0);
      };
      this.emitter.on(eventName, listener);
    });
  }

  async connect(chainIds: string | string[]): Promise<void> {
    if (!this.addresses) {
      this.client.connect();
      await this.getPromiseFromEvent('connect');
    }
  }

  async getSimpleAccount(chainId: string) {
    if (!this.addresses) {
      return Promise.reject('Terra Station NOT connected yet.');
    }
    const address = this.addresses?.[chainId];
    if (!address) {
      return Promise.reject(`NO account for chain ${chainId}.`);
    }
    return {
      namespace: 'cosmos',
      chainId,
      address,
    };
  }

  // protected async _signAmino(
  //   chainId: string,
  //   signer: string,
  //   signDoc: StdSignDoc,
  //   signOptions?: SignOptions
  // ) {
  //   const resp = this.client.sign({
  //     ...signDoc,
  //     sequence: Number(signDoc.sequence),
  //     msgs: signDoc.msgs as any,
  //     fee: void 0,
  //   });
  //   this.logger?.debug(`Response of cosmos_signAmino`, resp);
  //   return resp;
  // }

  // async signAmino(
  //   chainId: string,
  //   signer: string,
  //   signDoc: StdSignDoc,
  //   signOptions?: SignOptions
  // ): Promise<AminoSignResponse> {
  //   const result = (await this._signAmino(
  //     chainId,
  //     signer,
  //     signDoc,
  //     signOptions
  //   )) as AminoSignResponse;
  //   return result;
  // }
}

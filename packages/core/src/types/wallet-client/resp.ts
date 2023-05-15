import { EncodedString } from '../common';
import { PublicKey, WalletAccount } from './account';
import { RawMethod } from './discriminator';

export interface Raw {
  method: RawMethod; // The method actually used in request.
  resp?: unknown;
}

/**
 * Response of methods in WalletClient
 */
export namespace Resp {
  /**
   * @key raw: the original response from wallet.
   * @key neat: the organized/standardized response by CosmosKit.
   */
  export interface General {
    raw?: Raw | Raw[];
    neat?: unknown;
  }
  export interface Void extends General {
    neat?: undefined;
  }

  export interface GetAccount extends General {
    neat?: {
      account: WalletAccount | WalletAccount[];
    };
  }
  /**
   * signature could be optional. i.e. Eversacale signMessage
   */
  export interface Sign extends General {
    neat?: {
      signature?: EncodedString;
      publicKey?: PublicKey;
      signedDoc?: unknown;
    };
  }
  export interface Verify extends General {
    neat?: {
      isValid: boolean;
    };
  }
  export interface Broadcast extends General {
    neat?: {
      block?: {
        hash: EncodedString;
        height?: string;
        timestamp?: string;
      };
    };
  }
}

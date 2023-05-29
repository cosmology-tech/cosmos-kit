import { EncodedString } from '../common';
import { Key, WalletAccount } from './account';
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
   * @key raw: The original response from wallet. You can also check what methods are actually used in the calling.
   * @key neat: The organized/standardized response by CosmosKit.
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
      accounts: WalletAccount[];
    };
  }
  /**
   * signature could be optional. i.e. Eversacale signMessage
   */
  export interface Sign extends General {
    neat?: {
      signature?: EncodedString;
      publicKey?: Key;
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

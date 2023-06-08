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
  export interface Base {
    raw?: Raw | Raw[];
    neat?: unknown;
  }
  export interface Void extends Base {
    neat?: undefined;
  }

  export interface GetAccount extends Base {
    neat?: {
      accounts: WalletAccount[];
    };
  }
  /**
   * signature could be optional. i.e. Eversacale signMessage
   */
  export interface Sign extends Base {
    neat?: {
      signature?: EncodedString;
      publicKey?: Key;
      signedDoc?: unknown;
    };
  }
  export interface Verify extends Base {
    neat?: {
      isValid: boolean;
    };
  }
  export interface Broadcast extends Base {
    neat?: {
      block?: {
        hash: EncodedString;
        height?: string;
        timestamp?: string;
      };
    };
  }
}

import { OfflineAminoSigner, StdSignature, StdSignDoc } from '@cosmjs/amino';
import { OfflineDirectSigner } from '@cosmjs/proto-signing';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

export interface LeapAccount {
  address: string;
  algo: string;
  bech32Address: string;
  isNanoLedger: boolean;
  name: string;
  pubKey: string;
}

export type capsuleOptions = {
  apiKey: string;
};

export type CosmosCapsule = {
  enable: (chainIds: string[] | string) => Promise<void>;
  suggestToken: (chainId: string, contractAddress: string) => Promise<void>;
  experimentalSuggestChain: (chainInfo: unknown) => Promise<void>;
  disconnect: () => Promise<void>;
  getKey: (chainId: string) => Promise<LeapAccount>;
  getOfflineSignerOnlyAmino: (chainId: string) => Promise<OfflineDirectSigner>;
  getOfflineSigner: (chainId: string) => Promise<OfflineDirectSigner>;
  signAmino: (
    chainId: string,
    signer: string,
    signDoc: StdSignDoc
  ) => Promise<StdSignature>;
  signArbitrary: (
    chainId: string,
    signer: string,
    data: string | Uint8Array
  ) => Promise<StdSignature>;
  signDirect: (
    chainId: string,
    signer: string,
    signDoc: SignDoc
  ) => Promise<StdSignature>;
  getOfflineSignerAuto: (chainId: string) => OfflineDirectSigner;
  getOfflineSignerDirect: (chainId: string) => OfflineDirectSigner;
  getOfflineSignerAmino: (chainId: string) => OfflineAminoSigner;
  request: unknown;
};

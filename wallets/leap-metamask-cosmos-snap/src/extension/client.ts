import {
  AminoSignResponse,
  OfflineAminoSigner,
  StdSignature,
  StdSignDoc,
} from '@cosmjs/amino';
import { Algo, DirectSignResponse } from '@cosmjs/proto-signing';
import { ChainRecord, SignType } from '@cosmos-kit/core';
import { SignOptions, WalletClient } from '@cosmos-kit/core';
import {
  ChainInfo,
  CosmjsOfflineSigner,
  experimentalSuggestChain,
  signArbitrary,
} from '@leapwallet/cosmos-snap-provider';
import {
  connectSnap,
  getKey,
  getSnap,
  ProviderLong,
  requestSignAmino,
  requestSignature,
} from '@leapwallet/cosmos-snap-provider';
import Long from 'long';

export class CosmosSnapClient implements WalletClient {
  readonly snapInstalled: boolean = false;
  private _defaultSignOptions: SignOptions = {
    preferNoSetFee: true,
    preferNoSetMemo: true,
    disableBalanceCheck: true,
  };

  get defaultSignOptions() {
    return this._defaultSignOptions;
  }

  setDefaultSignOptions(options: SignOptions) {
    this._defaultSignOptions = options;
  }

  constructor() {
    this.snapInstalled = localStorage.getItem('snapInstalled') === 'true';
  }

  async getSimpleAccount(chainId: string) {
    const { address, username } = await this.getAccount(chainId);
    return {
      namespace: 'cosmos',
      chainId,
      address,
      username,
    };
  }

  async handleConnect() {
    const installedSnap = await getSnap();
    if (!installedSnap) {
      await connectSnap();
    }
  }

  async getAccount(chainId: string) {
    await this.handleConnect();
    const key = await getKey(chainId);
    return {
      username: key?.address,
      address: key.address,
      algo: key.algo as Algo,
      pubkey: key.pubkey,
    };
  }

  getOfflineSigner(chainId: string, preferredSignType?: SignType) {
    switch (preferredSignType) {
      case 'amino':
        return this.getOfflineSignerAmino(chainId);
      case 'direct':
        return this.getOfflineSignerDirect(chainId);
      default:
        return this.getOfflineSignerAmino(chainId);
    }
  }

  getOfflineSignerAmino(chainId: string) {
    return new CosmjsOfflineSigner(chainId) as unknown as OfflineAminoSigner;
  }

  getOfflineSignerDirect(chainId: string) {
    return new CosmjsOfflineSigner(chainId);
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions
  ): Promise<AminoSignResponse> {
    return requestSignAmino(chainId, signer, signDoc);
  }

  async signDirect(
    chainId: string,
    signer: string,
    signDoc: {
      bodyBytes?: Uint8Array | null;
      authInfoBytes?: Uint8Array | null;
      chainId?: string | null;
      accountNumber?: ProviderLong | null;
    }
  ): Promise<DirectSignResponse> {
    const signature = requestSignature(
      chainId,
      signer,
      signDoc
    ) as unknown as DirectSignResponse;

    const accountNumber = signDoc.accountNumber;
    const modifiedAccountNumber = new Long(
      accountNumber!.low,
      accountNumber!.high,
      accountNumber!.unsigned
    );

    return {
      signature: signature.signature,
      signed: {
        ...signature.signed,
        accountNumber: modifiedAccountNumber,
        authInfoBytes: new Uint8Array(
          Object.values(signature.signed.authInfoBytes)
        ),
        bodyBytes: new Uint8Array(Object.values(signature.signed.bodyBytes)),
      },
    };
  }

  async signArbitrary(
    chainId: string,
    signer: string,
    data: string
  ): Promise<StdSignature> {
    return (await signArbitrary(
      chainId,
      signer,
      data
    )) as unknown as StdSignature;
  }

  async addChain(chainRecord: ChainRecord): Promise<void> {
    const chainInfo: ChainInfo = {
      chainId: chainRecord?.chain?.chain_id,
      chainName: chainRecord?.chain?.chain_name,
      bip44: { coinType: chainRecord?.chain?.slip44 },
      bech32Config: { bech32PrefixAccAddr: chainRecord?.chain?.bech32_prefix },
    };
    await experimentalSuggestChain(chainInfo);
  }
}

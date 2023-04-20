import { OfflineAminoSigner } from '@cosmjs/amino';
import { DirectSecp256k1Wallet } from '@cosmjs/proto-signing';
import { WalletClient } from '@cosmos-kit/core';
import { CHAIN_NAMESPACES } from '@web3auth/base';
import { Web3Auth } from '@web3auth/modal';
import { chains } from 'chain-registry';

import { Web3AuthCustomSigner } from './signer';

export class Web3AuthClient implements WalletClient {
  readonly client: Web3Auth;

  modalInitComplete = false;

  // Map chainId to signer.
  signers: Record<string, DirectSecp256k1Wallet | undefined> = {};

  constructor() {
    this.client = new Web3Auth({
      // Get from developer dashboard.
      clientId: 'randomlocalhost',
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.OTHER,
      },
    });
  }

  async getPrivateKey(): Promise<Uint8Array> {
    const privateKeyHex = await this.client.provider.request({
      method: 'private_key',
    });
    if (typeof privateKeyHex !== 'string') {
      throw new Error('Invalid private key');
    }
    return Uint8Array.from(Buffer.from(privateKeyHex, 'hex'));
  }

  async connect(_chainIds: string | string[]) {
    // Only connect to chains that are not already connected.
    const chainIds = [_chainIds]
      .flat()
      .filter((chainId) => !(chainId in this.signers));
    if (chainIds.length === 0) {
      return;
    }

    if (!this.modalInitComplete) {
      await this.client.initModal();
      this.modalInitComplete = true;
    }

    await this.client.connect();

    // Get private key.
    const privateKey = await this.getPrivateKey();

    // TODO: Is there a better way to get the prefix for a chain ID. Retrieve
    // from passed in chain info somehow?

    // Get chain prefixes for IDs, erroring if any could not be found.
    const chainPrefixes = chainIds.map((chainId): string => {
      const chain = chains.find(({ chain_id }) => chain_id === chainId);
      if (!chain) {
        throw new Error(`Chain ID ${chainId} not found`);
      }
      return chain.bech32_prefix;
    });

    // Create signers for chains.
    await Promise.all(
      chainIds.map(async (chainId, index) => {
        this.signers[chainId] = await DirectSecp256k1Wallet.fromKey(
          privateKey,
          chainPrefixes[index]
        );
      })
    );
  }

  async disconnect() {
    if (this.client.status === 'connected') {
      await this.client.logout();
    }
    this.signers = {};
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

  async getAccount(chainId: string) {
    await this.connect(chainId);

    const signer = this.signers[chainId];
    if (!signer) {
      throw new Error('Signer not enabled');
    }

    const info = await this.client.getUserInfo();

    const account = (await signer.getAccounts())[0];

    return {
      username: info.name || info.email || account.address,
      ...account,
    };
  }

  getOfflineSigner(chainId: string) {
    return this.getOfflineSignerDirect(chainId);
  }

  getOfflineSignerAmino(): OfflineAminoSigner {
    throw new Error('Not implemented');
  }

  getOfflineSignerDirect(chainId: string) {
    return new Web3AuthCustomSigner(this, chainId);
  }
}

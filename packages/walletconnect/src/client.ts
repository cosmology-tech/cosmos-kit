import {
  AminoSignResponse,
  OfflineAminoSigner,
  StdSignDoc,
} from '@cosmjs/amino';
import { DirectSignResponse, OfflineDirectSigner } from '@cosmjs/proto-signing';
import {
  DirectSignDoc,
  ExpiredError,
  Logger,
  Mutable,
  RejectedError,
  SignOptions,
  State,
  Wallet,
  WalletAccount,
  WalletClient,
  WalletClientActions,
  WalletConnectOptions,
} from '@cosmos-kit/core';
import SignClient from '@walletconnect/sign-client';
import { getSdkError } from '@walletconnect/utils';
import { PairingTypes, SessionTypes } from '@walletconnect/types';
import EventEmitter from 'events';
import { WCAccount } from './types';
import { CoreUtil } from './utils';

const EXPLORER_API = 'https://explorer-api.walletconnect.com';

type Namespace = string;
type ChainId = string;
type Address = string;

export class WCClient implements WalletClient {
  readonly walletInfo: Wallet;
  walletProjectId: string; // walletconnect wallet project id
  walletWCName: string; // walletconnect wallet name
  signClient?: SignClient;
  wcWalletInfo?: any;
  actions?: WalletClientActions;
  qrUrl: Mutable<string>;
  appUrl: Mutable<string>;

  pairings?: PairingTypes.Struct[] = [];
  session?: SessionTypes.Struct;
  emitter!: EventEmitter;
  logger?: Logger;
  options?: WalletConnectOptions;
  relayUrl?: string;

  constructor(walletInfo: Wallet) {
    if (!walletInfo.walletconnect) {
      throw new Error(
        `'walletconnect' info for wallet ${walletInfo.prettyName} is not provided in wallet registry.`
      );
    }
    this.walletInfo = walletInfo;
    this.walletProjectId = walletInfo.walletconnect!.projectId;
    this.walletWCName = walletInfo.walletconnect!.name;

    this.qrUrl = { state: State.Init };
    this.appUrl = { state: State.Init };
  }

  get accounts(): [Namespace, ChainId, Address][] {
    if (!this.session) {
      return [];
    }
    const accounts = [];
    Object.entries(this.session.namespaces).forEach(([, nsValue]) => {
      nsValue.accounts.forEach((account) => {
        accounts.push(account.split(':'));
      });
    });
    return accounts;
  }

  reset() {
    this.session = void 0;
    this.relayUrl = void 0;
    this.emitter.emit('sync_disconnect');
  }

  subscribeToEvents() {
    if (typeof this.signClient === 'undefined') {
      throw new Error('WalletConnect is not initialized');
    }

    this.signClient.on('session_ping', (args) => {
      this.logger?.info('EVENT', 'session_ping', args);
    });

    this.signClient.on('session_event', async (args) => {
      this.logger?.info('EVENT', 'session_event', args);
      const {
        topic,
        params: { event, chainId },
      } = args;
      if (this.session?.topic != topic) return;
      if (event.name === 'accountsChanged') {
        await this.connect(
          this.accounts.map(([, chainId]) => chainId),
          false
        );
      }
    });

    this.signClient.on('session_update', ({ topic, params }) => {
      this.logger?.info('EVENT', 'session_update', { topic, params });
      if (this.session?.topic != topic) return;

      const { namespaces } = params;
      const _session = this.signClient.session.get(topic);
      const updatedSession = { ..._session, namespaces };
      this.session = updatedSession;
    });

    this.signClient.on('session_delete', (args) => {
      this.logger?.info('EVENT', 'session_delete', args);
      this.reset();
    });

    this.signClient.on('session_expire', (args) => {
      this.logger?.info('EVENT', 'session_expire', args);
      this.reset();
    });

    this.signClient.on('session_proposal', (args) => {
      this.logger?.info('EVENT', 'session_proposal', args);
    });

    this.signClient.on('session_request', (args) => {
      this.logger?.info('EVENT', 'session_request', args);
    });

    this.signClient.on('proposal_expire', (args) => {
      this.logger?.info('EVENT', 'proposal_expire', args);
      this.setQRError(ExpiredError);
    });
  }

  async deleteInactivePairings() {
    if (typeof this.signClient === 'undefined') {
      throw new Error('WalletConnect is not initialized');
    }
    for (const pairing of this.signClient.pairing.getAll({ active: false })) {
      await this.signClient.pairing.delete(pairing.topic, {
        code: 7001,
        message: 'Clear inactive pairings.',
      });
    }
  }

  restorePairings() {
    if (typeof this.signClient === 'undefined') {
      throw new Error('WalletConnect is not initialized');
    }
    this.pairings = this.signClient.pairing
      .getAll({ active: true })
      .filter(
        (p) =>
          p.peerMetadata?.name === this.walletWCName &&
          p.expiry * 1000 > Date.now() + 1000
      );
    this.logger?.info('RESTORED PAIRINGS: ', this.pairings);
  }

  get pairing(): PairingTypes.Struct | undefined {
    return this.pairings[0];
  }

  restoreSession() {
    if (typeof this.signClient === 'undefined') {
      throw new Error('WalletConnect is not initialized');
    }
    if (typeof this.session !== 'undefined') return;

    const targetKey = this.signClient.session.keys.reverse().find((key) => {
      const session = this.signClient.session.get(key);
      return (
        session.peer.metadata.name === this.walletWCName &&
        session.expiry * 1000 > Date.now() + 1000
      );
    });

    if (targetKey) {
      this.session = this.signClient.session.get(targetKey);
      this.logger?.info('RESTORED SESSION:', this.session);
    }
  }

  get walletName() {
    return this.walletInfo.name;
  }

  get dappProjectId() {
    return this.options?.signClient.projectId;
  }

  async fetchWCWalletInfo() {
    const fetcUrl = `${EXPLORER_API}/v3/wallets?projectId=${this.dappProjectId}&sdks=sign_v2&search=${this.walletWCName}`;
    const fetched = await (await fetch(fetcUrl)).json();
    this.wcWalletInfo =
      fetched.listings[this.walletInfo.walletconnect?.projectId!];
  }

  setActions(actions: WalletClientActions) {
    this.actions = actions;
  }

  setQRState(state: State) {
    this.qrUrl.state = state;
    this.actions?.qrUrl?.state(state);
  }

  setQRError(e?: Error | string) {
    this.setQRState(State.Error);
    this.qrUrl.message = typeof e === 'string' ? e : e?.message;
    this.actions?.qrUrl?.message(this.qrUrl.message);
    if (typeof e !== 'string' && e?.stack) {
      this.logger?.error(e.stack);
    }
  }

  async initSignClient() {
    if (
      this.signClient &&
      this.relayUrl === this.options?.signClient.relayUrl
    ) {
      return;
    }

    this.signClient = await SignClient.init(this.options?.signClient);
    this.relayUrl = this.options?.signClient.relayUrl;

    this.logger?.info('CREATED CLIENT: ', this.signClient);
    this.logger?.info('relayerRegion ', this.options?.signClient.relayUrl);

    this.subscribeToEvents();
    this.restorePairings();
    this.restoreSession();
  }

  async connect(chainIds: string | string[], isMobile: boolean) {
    if (typeof this.signClient === 'undefined') {
      throw new Error('WalletConnect is not initialized');
    }

    if (this.qrUrl.state !== 'Init') {
      this.setQRState(State.Init);
    }

    const chainIdsWithNS =
      typeof chainIds === 'string'
        ? [`cosmos:${chainIds}`]
        : chainIds.map((chainId) => `cosmos:${chainId}`);

    if (
      this.session &&
      this.accounts.filter((account) =>
        chainIdsWithNS.includes(`${account[0]}:${account[1]}`)
      )
    ) {
      return;
    }

    const pairing = this.pairing;

    this.logger?.info('Restored active pairing topic is:', pairing?.topic);

    if (!pairing) this.setQRState(State.Pending);

    const requiredNamespaces = {
      cosmos: {
        methods: [
          'cosmos_getAccounts',
          'cosmos_signAmino',
          'cosmos_signDirect',
        ],
        chains: chainIdsWithNS,
        events: ['chainChanged', 'accountsChanged'],
      },
    };
    let connectResp: any;
    try {
      await this.deleteInactivePairings();
      connectResp = await this.signClient.connect({
        pairingTopic: pairing?.topic,
        requiredNamespaces,
      });
      this.qrUrl.data = connectResp.uri;
      this.logger?.info('Using QR URI:', connectResp.uri);
      if (!pairing) this.setQRState(State.Done);
    } catch (error) {
      this.logger?.error('Client connect error: ', error);
      if (!pairing) this.setQRError(error);
      return;
    }

    if (isMobile) {
      this.appUrl.state = State.Pending;
      this.appUrl.data = await this.getAppUrl();
      this.appUrl.state = State.Done;
      CoreUtil.openHref(this.appUrl.data);
    }

    try {
      this.session = await connectResp.approval();
      this.logger?.info('Established session:', this.session);
      this.restorePairings();
    } catch (error) {
      this.logger?.error('Session approval error: ', error);
      if (!error) {
        this.setQRError(ExpiredError);
        throw new Error('QRCode Expired');
      } else if (error.code == 5001) {
        throw RejectedError;
      } else {
        throw error;
      }
    } finally {
      if (!pairing && this.qrUrl.message !== ExpiredError.message) {
        this.setQRState(State.Init);
      }
    }
  }

  async getAppUrl(): Promise<string | undefined> {
    if (!this.wcWalletInfo) {
      await this.fetchWCWalletInfo();
    }

    const { native, universal } = this.wcWalletInfo.mobile as {
      native: string | null;
      universal: string | null;
    };

    let href: string | undefined;
    if (universal) {
      href = CoreUtil.formatUniversalUrl(
        universal,
        this.qrUrl.data,
        this.walletName
      );
    } else if (native) {
      href = CoreUtil.formatNativeUrl(native, this.qrUrl.data, this.walletName);
    }
    return href;
  }

  async disconnect() {
    if (typeof this.signClient === 'undefined') {
      throw new Error('WalletConnect is not initialized');
    }
    if (typeof this.session === 'undefined') {
      return;
    }

    this.logger?.info('Delete session:', this.session);
    try {
      await this.signClient.disconnect({
        topic: this.session.topic,
        reason: getSdkError('USER_DISCONNECTED'),
      });
    } catch (error) {
      this.logger?.error('SignClient.disconnect failed:', error);
    } finally {
      this.reset();
    }
  }

  async getAccount(chainId: string): Promise<WalletAccount> {
    const account = this.accounts.find(([, _chainId]) => _chainId === chainId);
    if (!account) {
      throw new Error(
        `Chain ${chainId} is not connected yet, please check the session approval namespaces`
      );
    }
    return {
      address: account[2],
    };
  }

  async getKey(chainId: string) {
    const resp = await this.signClient.request({
      topic: this.session.topic,
      chainId: `cosmos:${chainId}`,
      request: {
        method: 'cosmos_getAccounts',
        params: {},
      },
    });
    const result = (resp as any)['result'][0] as WCAccount;

    return {
      address: result.address,
      algo: result.algo,
      pubkey: Buffer.from(result.pubkey, 'hex'),
    };
  }

  getOfflineSignerAmino(chainId: string) {
    return {
      getAccounts: async () => [await this.getAccount(chainId)],
      signAmino: (signerAddress: string, signDoc: StdSignDoc) =>
        this.signAmino(chainId, signerAddress, signDoc),
    } as OfflineAminoSigner;
  }

  getOfflineSignerDirect(chainId: string) {
    return {
      getAccounts: async () => [await this.getAccount(chainId)],
      signDirect: (signerAddress: string, signDoc: DirectSignDoc) =>
        this.signDirect(chainId, signerAddress, signDoc),
    } as OfflineDirectSigner;
  }

  // getOfflineSignerAmino(chainId: string) {
  //   return {
  //     getAccounts: async () => [await this.getKey(chainId)],
  //     signAmino: (signerAddress: string, signDoc: StdSignDoc) =>
  //       this.signAmino(chainId, signerAddress, signDoc),
  //   } as OfflineAminoSigner;
  // }

  // getOfflineSignerDirect(chainId: string) {
  //   return {
  //     getAccounts: async () => [await this.getKey(chainId)],
  //     signDirect: (signerAddress: string, signDoc: DirectSignDoc) =>
  //       this.signDirect(chainId, signerAddress, signDoc),
  //   } as OfflineDirectSigner;
  // }

  async getOfflineSigner(chainId: string) {
    const key = await this.getAccount(chainId);
    if (key.isNanoLedger) {
      return this.getOfflineSignerAmino(chainId);
    }
    return this.getOfflineSignerDirect(chainId);
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions
  ): Promise<AminoSignResponse> {
    return ((await this.signClient.request({
      topic: this.session.topic,
      chainId: null,
      request: {
        method: 'wc_sessionRequest',
        params: {
          chainId: `cosmos:${chainId}`,
          request: {
            method: 'cosmos_signAmino',
            params: {
              signerAddress: signer,
              signDoc,
            },
          },
        },
      },
    })) as any)['result'] as AminoSignResponse;
  }

  async signDirect(
    chainId: string,
    signer: string,
    signDoc: DirectSignDoc,
    signOptions?: SignOptions
  ): Promise<DirectSignResponse> {
    return ((await this.signClient.request({
      topic: this.session.topic,
      chainId: null,
      request: {
        method: 'wc_sessionRequest',
        params: {
          chainId: `cosmos:${chainId}`,
          request: {
            method: 'cosmos_signDirect',
            params: {
              signerAddress: signer,
              signDoc,
            },
          },
        },
      },
    })) as any)['result'] as DirectSignResponse;
  }
}

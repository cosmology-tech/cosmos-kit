import {
  AminoSignResponse,
  OfflineAminoSigner,
  StdSignDoc,
} from '@cosmjs/amino';
import {
  Algo,
  DirectSignResponse,
  OfflineDirectSigner,
} from '@cosmjs/proto-signing';
import {
  DirectSignDoc,
  ExpiredError,
  Logger,
  Mutable,
  RejectedError,
  SignOptions,
  SimpleAccount,
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
import { CoreUtil } from './utils';
import { WCAccount, WCSignDirectRequest, WCSignDirectResponse } from './types';
import Long from 'long';

const EXPLORER_API = 'https://explorer-api.walletconnect.com';

export class WCClient implements WalletClient {
  readonly walletInfo: Wallet;
  walletProjectId: string; // walletconnect wallet project id
  walletWCName: string; // walletconnect wallet name
  signClient?: SignClient;
  wcWalletInfo?: any;
  actions?: WalletClientActions;
  qrUrl: Mutable<string>;
  appUrl: Mutable<string>;

  pairings: PairingTypes.Struct[] = [];
  sessions: SessionTypes.Struct[] = [];
  emitter?: EventEmitter;
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

  get accounts(): SimpleAccount[] {
    const accounts = [];
    this.sessions.forEach((s) => {
      Object.entries(s.namespaces).forEach(([, nsValue]) => {
        nsValue.accounts.forEach((account) => {
          const [namespace, chainId, address] = account.split(':');
          accounts.push({
            namespace,
            chainId,
            address,
          });
        });
      });
    });
    return accounts;
  }

  deleteSession(topic: string) {
    const chainIds = [];
    this.sessions = this.sessions.filter((s) => {
      if (s.topic === topic) {
        s.namespaces.cosmos.accounts.forEach((account) => {
          const [, chainId] = account.split(':');
          chainIds.push(chainId);
        });
        return false;
      } else {
        return true;
      }
    });
    this.emitter?.emit('reset', chainIds);
    this.logger?.info('[WALLET EVENT] Emit `reset`');
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
      // const {
      //   topic,
      //   params: { event, chainId },
      // } = args;
      // if (this.session?.topic != topic) return;
      // if (event.name === 'accountsChanged') {
      //   await this.connect(
      //     this.accounts.map(([, chainId]) => chainId),
      //     false
      //   );
      // }
    });

    this.signClient.on('session_update', ({ topic, params }) => {
      this.logger?.info('EVENT', 'session_update', { topic, params });
      // if (this.session?.topic != topic) return;

      // const { namespaces } = params;
      // const _session = this.signClient.session.get(topic);
      // this.session = { ..._session, namespaces };
    });

    this.signClient.on('session_delete', (args) => {
      this.logger?.info('EVENT', 'session_delete', args);
      this.deleteSession(args.topic);
    });

    this.signClient.on('session_expire', (args) => {
      this.logger?.info('EVENT', 'session_expire', args);
      this.deleteSession(args.topic);
    });

    this.signClient.on('session_proposal', (args) => {
      this.logger?.info('EVENT', 'session_proposal', args);
    });

    this.signClient.on('session_request', (args) => {
      this.logger?.info('EVENT', 'session_request', args);
    });

    this.signClient.on('proposal_expire', (args) => {
      this.logger?.info('EVENT', 'proposal_expire', args);
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
      this.logger?.info('Delete inactive pairing:', pairing.topic);
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

  restoreSessions() {
    if (typeof this.signClient === 'undefined') {
      throw new Error('WalletConnect is not initialized');
    }
    this.sessions = this.signClient.session
      .getAll()
      .filter(
        (s) =>
          s.peer.metadata.name === this.walletWCName &&
          s.expiry * 1000 > Date.now() + 1000
      );
    this.logger?.info('RESTORED SESSIONS: ', this.sessions);
  }

  getSession(namespace: string, chainId: string) {
    return this.sessions.find((s) =>
      s.namespaces[namespace]?.accounts?.find((account) =>
        account.startsWith(`${namespace}:${chainId}`)
      )
    );
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
    this.restoreSessions();
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

    this.restorePairings();
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
      this.logger?.info('Connecting chains:', chainIdsWithNS);
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
      if (this.appUrl.data) {
        CoreUtil.openHref(this.appUrl.data);
      } else {
        this.logger?.warn("Can't get app url:", this.walletName);
      }
    }

    try {
      const session = await connectResp.approval();
      this.logger?.info('Established session:', session);
      this.sessions.push(session);
      this.restorePairings();
    } catch (error) {
      this.logger?.error('Session approval error: ', error);
      await this.deleteInactivePairings();
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
    if (this.sessions.length === 0) {
      return;
    }

    for (const session of this.sessions) {
      try {
        this.logger?.info('Delete session:', session);
        await this.signClient.disconnect({
          topic: session.topic,
          reason: getSdkError('USER_DISCONNECTED'),
        });
      } catch (error) {
        this.logger?.error(
          `SignClient.disconnect session ${session.topic} failed:`,
          error
        );
      }
    }
    this.sessions = [];
    this.emitter?.emit('sync_disconnect');
    this.logger?.info('[WALLET EVENT] Emit `sync_disconnect`');
  }

  async getSimpleAccount(chainId: string): Promise<SimpleAccount> {
    const account = this.accounts.find(({ chainId: id }) => id === chainId);
    if (!account) {
      throw new Error(
        `Chain ${chainId} is not connected yet, please check the session approval namespaces`
      );
    }
    return account;
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

  async getOfflineSigner(chainId: string) {
    return this.getOfflineSignerDirect(chainId);
  }

  protected async _getAccount(chainId: string) {
    const session = this.getSession('cosmos', chainId);
    if (!session) {
      throw new Error(`Session for ${chainId} not established yet.`);
    }
    const resp = await this.signClient.request({
      topic: session.topic,
      chainId: `cosmos:${chainId}`,
      request: {
        method: 'cosmos_getAccounts',
        params: {},
      },
    });
    this.logger?.info(`Response of cosmos_getAccounts`, resp);
    return resp;
  }

  async getAccount(chainId: string): Promise<WalletAccount> {
    const { address, algo, pubkey } = (
      await this._getAccount(chainId)
    )[0] as WCAccount;
    return {
      address,
      algo: algo as Algo,
      pubkey: new Uint8Array(Buffer.from(pubkey, 'hex')),
    };
  }

  protected async _signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions
  ) {
    const session = this.getSession('cosmos', chainId);
    if (!session) {
      throw new Error(`Session for ${chainId} not established yet.`);
    }
    const resp = await this.signClient.request({
      topic: session.topic,
      chainId: `cosmos:${chainId}`,
      request: {
        method: 'cosmos_signAmino',
        params: {
          signerAddress: signer,
          signDoc,
        },
      },
    });
    this.logger?.info(`Response of cosmos_signAmino`, resp);
    return resp;
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions
  ): Promise<AminoSignResponse> {
    const result = (await this._signAmino(
      chainId,
      signer,
      signDoc,
      signOptions
    )) as AminoSignResponse;
    return result;
  }

  async _signDirect(
    chainId: string,
    signer: string,
    signDoc: DirectSignDoc,
    signOptions?: SignOptions
  ) {
    const session = this.getSession('cosmos', chainId);
    if (!session) {
      throw new Error(`Session for ${chainId} not established yet.`);
    }
    const signDocValue: WCSignDirectRequest = {
      signerAddress: signer,
      signDoc: {
        chainId: signDoc.chainId,
        bodyBytes: Buffer.from(signDoc.bodyBytes).toString('hex'),
        authInfoBytes: Buffer.from(signDoc.authInfoBytes).toString('hex'),
        accountNumber: signDoc.accountNumber.toString(),
      },
    };
    const resp = await this.signClient.request({
      topic: session.topic,
      chainId: `cosmos:${chainId}`,
      request: {
        method: 'cosmos_signDirect',
        params: signDocValue,
      },
    });
    this.logger?.info(`Response of cosmos_signDirect`, resp);
    return resp;
  }

  async signDirect(
    chainId: string,
    signer: string,
    signDoc: DirectSignDoc,
    signOptions?: SignOptions
  ): Promise<DirectSignResponse> {
    const { signed, signature } = (await this._signDirect(
      chainId,
      signer,
      signDoc,
      signOptions
    )) as WCSignDirectResponse;
    return {
      signed: {
        chainId: signed.chainId,
        accountNumber: Long.fromString(signed.accountNumber, false),
        authInfoBytes: new Uint8Array(Buffer.from(signed.authInfoBytes, 'hex')),
        bodyBytes: new Uint8Array(Buffer.from(signed.bodyBytes, 'hex')),
      },
      signature,
    };
  }

  // restoreLatestSession() {
  //   if (typeof this.signClient === 'undefined') {
  //     throw new Error('WalletConnect is not initialized');
  //   }
  //   if (typeof this.session !== 'undefined') return;

  //   const targetKey = this.signClient.session.keys.reverse().find((key) => {
  //     const session = this.signClient.session.get(key);
  //     return (
  //       session.peer.metadata.name === this.walletWCName &&
  //       session.expiry * 1000 > Date.now() + 1000
  //     );
  //   });

  //   if (targetKey) {
  //     this.session = this.signClient.session.get(targetKey);
  //     this.logger?.info('RESTORED LATEST SESSION:', this.session);
  //   }
  // }
}

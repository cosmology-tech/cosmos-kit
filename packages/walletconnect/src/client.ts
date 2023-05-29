import {
  ExpiredError,
  AppUrl,
  Mutable,
  RejectedError,
  State,
  Wallet,
  WalletAccount,
  WalletClientActions,
  DappEnv,
  Namespace,
  WalletClientBase,
  Args,
  Resp,
  ReqArgs,
  ChainId,
  Raw,
} from '@cosmos-kit/core';
import SignClient from '@walletconnect/sign-client';
import { getSdkError } from '@walletconnect/utils';
import { PairingTypes, SessionTypes } from '@walletconnect/types';
import EventEmitter from 'events';
import { CoreUtil, getPrefix } from './utils';
import {
  WalletConnectOptions,
  CosmosAccount,
  SolanaAccount,
  NearAccount,
  GeneralParams,
  TezosAccount,
  WCTypeParams,
} from './types';
import { namespacesConfig, discriminators } from './config';
import { SignAndBroadcastResult, SignResult } from './types';

const EXPLORER_API = 'https://explorer-api.walletconnect.com';

export class WCClient extends WalletClientBase<WCTypeParams> {
  readonly walletInfo: Wallet;
  readonly options?: WalletConnectOptions;

  signClient?: SignClient;
  wcCloudInfo?: any; // info from WalletConnect Cloud Explorer
  actions?: WalletClientActions;
  qrUrl: Mutable<string>;
  appUrl: Mutable<AppUrl>;

  pairings: PairingTypes.Struct[] = [];
  sessions: SessionTypes.Struct[] = [];
  emitter?: EventEmitter;
  relayUrl?: string;
  env?: DappEnv;

  constructor(walletInfo: Wallet, options?: WalletConnectOptions) {
    super(discriminators, options);
    if (!walletInfo.walletconnect) {
      throw new Error(
        `'walletconnect' info for wallet ${walletInfo.prettyName} is not provided in wallet registry.`
      );
    }
    this.walletInfo = walletInfo;

    this.qrUrl = { state: State.Init };
    this.appUrl = { state: State.Init };
  }

  get isMobile() {
    return this.env?.device === 'mobile';
  }

  // walletconnect wallet name
  get wcName(): string {
    return this.walletInfo.walletconnect.name;
  }

  // wallet defined bytes encoding
  get wcEncoding(): BufferEncoding {
    return this.walletInfo.walletconnect.encoding || 'hex';
  }

  // walletconnect wallet project id
  get wcProjectId(): string {
    return this.walletInfo.walletconnect.projectId;
  }

  // walletconnect wallet mobile link
  get wcMobile() {
    return this.walletInfo.walletconnect.mobile;
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
    this.logger?.debug('[WALLET EVENT] Emit `reset`');
  }

  protected async _subscribeToEvents() {
    if (typeof this.signClient === 'undefined') {
      await this.init();
    }

    this.signClient.on('session_ping', (args) => {
      this.logger?.debug('EVENT', 'session_ping', args);
    });

    this.signClient.on('session_event', async (args) => {
      this.logger?.debug('EVENT', 'session_event', args);
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
      this.logger?.debug('EVENT', 'session_update', { topic, params });
      // if (this.session?.topic != topic) return;

      // const { namespaces } = params;
      // const _session = this.signClient.session.get(topic);
      // this.session = { ..._session, namespaces };
    });

    this.signClient.on('session_delete', (args) => {
      this.logger?.debug('EVENT', 'session_delete', args);
      this.deleteSession(args.topic);
    });

    this.signClient.on('session_expire', (args) => {
      this.logger?.debug('EVENT', 'session_expire', args);
      this.deleteSession(args.topic);
    });

    this.signClient.on('session_proposal', (args) => {
      this.logger?.debug('EVENT', 'session_proposal', args);
    });

    this.signClient.on('session_request', (args) => {
      this.logger?.debug('EVENT', 'session_request', args);
    });

    this.signClient.on('proposal_expire', (args) => {
      this.logger?.debug('EVENT', 'proposal_expire', args);
    });
  }

  protected async _deleteInactivePairings() {
    if (typeof this.signClient === 'undefined') {
      await this.init();
    }

    for (const pairing of this.signClient.pairing.getAll({ active: false })) {
      await this.signClient.pairing.delete(pairing.topic, {
        code: 7001,
        message: 'Clear inactive pairings.',
      });
      this.logger?.debug('Delete inactive pairing:', pairing.topic);
    }
  }

  protected async _restorePairings() {
    if (typeof this.signClient === 'undefined') {
      await this.init();
    }
    this.pairings = this.signClient.pairing
      .getAll({ active: true })
      .filter(
        (p) =>
          p.peerMetadata?.name === this.wcName &&
          p.expiry * 1000 > Date.now() + 1000
      );
    this.logger?.debug('RESTORED PAIRINGS: ', this.pairings);
  }

  get pairing(): PairingTypes.Struct | undefined {
    return this.pairings[0];
  }

  protected async _restoreSessions() {
    if (typeof this.signClient === 'undefined') {
      await this.init();
    }
    this.sessions = this.signClient.session
      .getAll()
      .filter(
        (s) =>
          s.peer.metadata.name === this.wcName &&
          s.expiry * 1000 > Date.now() + 1000
      );
    this.logger?.debug('RESTORED SESSIONS: ', this.sessions);
  }

  protected _getSession(prefix: string, chainId: string): SessionTypes.Struct {
    return this.sessions.find((s) => {
      if (!s.namespaces[prefix]) {
        return false;
      }
      const { accounts } = s.namespaces[prefix];
      return accounts.find((acc) => acc.startsWith(`${prefix}:${chainId}`));
    });
  }

  protected _getSessionWithMethod(
    prefix: string,
    chainId: string,
    method: string
  ): SessionTypes.Struct {
    const session = this.sessions.find((s) => {
      if (!s.namespaces[prefix]) {
        return false;
      }
      const { accounts, methods } = s.namespaces[prefix];
      return (
        accounts.find((acc) => acc.startsWith(`${prefix}:${chainId}`)) &&
        methods.findIndex((m) => m === method) !== -1
      );
    });

    if (typeof session === 'undefined') {
      throw new Error(
        `Session for ${chainId} with method ${method} not established yet.`
      );
    }
    return session;
  }

  protected _getAccountFromSession(
    namespace: Namespace,
    chainId: string
  ): WalletAccount[] {
    const prefix = getPrefix(namespace);
    const session = this._getSession(prefix, chainId);
    const accounts: WalletAccount[] = [];
    Object.entries(session.namespaces).forEach(([, nsValue]) => {
      nsValue.accounts.forEach((account) => {
        const [prefix2, chainId, address] = account.split(':');
        if (prefix === prefix2) {
          accounts.push({
            address: address,
            namespace,
            chainId,
          });
        }
      });
    });
    return accounts;
  }

  get walletName() {
    return this.walletInfo.name;
  }

  get dappProjectId() {
    return this.options?.initSignClientOptions.projectId;
  }

  setActions(actions: WalletClientActions) {
    this.actions = actions;
  }

  setQRState(state: State) {
    this.qrUrl.state = state;
    this.actions?.qrUrl?.state?.(state);
  }

  setQRError(e?: Error | string) {
    this.setQRState(State.Error);
    this.qrUrl.message = typeof e === 'string' ? e : e?.message;
    this.actions?.qrUrl?.message?.(this.qrUrl.message);
    if (typeof e !== 'string' && e?.stack) {
      this.logger?.error(e.stack);
    }
  }

  async init() {
    await this.initSignClient();
    if (this.isMobile) {
      await this.initAppUrl();
    }
  }

  protected async initSignClient() {
    if (
      this.signClient &&
      this.relayUrl === this.options?.initSignClientOptions.relayUrl
    ) {
      return;
    }

    this.signClient = await SignClient.init(
      this.options?.initSignClientOptions
    );
    this.relayUrl = this.options?.initSignClientOptions.relayUrl;

    this.logger?.debug('CREATED CLIENT: ', this.signClient);
    this.logger?.debug('relayerRegion ', this.relayUrl);

    await this._subscribeToEvents();
    await this._restorePairings();
    await this._restoreSessions();
  }

  protected async initWCCloudInfo() {
    const fetcUrl = `${EXPLORER_API}/v3/wallets?projectId=${this.dappProjectId}&sdks=sign_v2&search=${this.wcName}`;
    const fetched = await (await fetch(fetcUrl)).json();
    this.wcCloudInfo =
      fetched.listings[this.walletInfo.walletconnect?.projectId!];
    this.logger?.debug('WalletConnect Info:', this.wcCloudInfo);
  }

  protected async initAppUrl() {
    this.appUrl.state = State.Pending;

    if (!this.wcCloudInfo) await this.initWCCloudInfo();

    const native = this.wcCloudInfo.mobile.native || this.wcMobile?.native;
    const universal =
      this.wcCloudInfo.mobile.universal || this.wcMobile?.universal;

    this.appUrl.data = { native, universal };
    this.appUrl.state = State.Done;
  }

  get nativeUrl() {
    return this.appUrl.data?.native;
  }

  get universalUrl() {
    return this.appUrl.data?.universal;
  }

  get redirectHref(): string | undefined {
    return this.nativeUrl || this.universalUrl;
  }

  get redirectHrefWithWCUri(): string | undefined {
    let href: string | undefined;
    if (this.nativeUrl) {
      href = (
        this.walletInfo.walletconnect.formatNativeUrl ||
        CoreUtil.formatNativeUrl
      )(this.nativeUrl, this.qrUrl.data, this.walletName);
    } else if (this.universalUrl) {
      href = (
        this.walletInfo.walletconnect.formatNativeUrl ||
        CoreUtil.formatUniversalUrl
      )(this.universalUrl, this.qrUrl.data, this.walletName);
    }
    return href;
  }

  get displayQRCode() {
    if (this.pairing || this.redirect) {
      return false;
    } else {
      return true;
    }
  }

  get redirect() {
    return Boolean(this.isMobile && (this.nativeUrl || this.universalUrl));
  }

  openApp(withWCUri: boolean = true) {
    const href = withWCUri ? this.redirectHrefWithWCUri : this.redirectHref;
    if (href) {
      this.logger?.debug('Redirecting:', href);
      CoreUtil.openHref(href);
    } else {
      this.logger?.error('No redirecting href.');
    }
  }

  async enable(args: Args.AuthRelated[]): Promise<Resp.Void> {
    if (typeof this.signClient === 'undefined') {
      await this.init();
    }

    if (this.qrUrl.state !== 'Init') {
      this.setQRState(State.Init);
    }

    await this._restorePairings();
    const pairing = this.pairing;
    this.logger?.debug('Restored active pairing topic is:', pairing?.topic);

    if (this.displayQRCode) this.setQRState(State.Pending);

    const requiredNamespaces = Object.fromEntries(
      args.map(({ namespace, params }) => {
        if (!namespacesConfig[namespace]) {
          throw new Error(`No matched config for namespace ${namespace}.`);
        }
        const { prefix, methods, events } = namespacesConfig[namespace];

        return [
          prefix,
          {
            chains: params.chainIds
              ? params.chainIds.map((chainId) => `${prefix}:${chainId}`)
              : void 0,
            methods: params.methods || methods,
            events: params.events || events,
          },
        ];
      })
    );

    let connectResp: any;
    try {
      this.logger?.debug('Connecting namespaces:', requiredNamespaces);
      connectResp = await this.signClient.connect({
        pairingTopic: pairing?.topic,
        requiredNamespaces,
      });
      this.qrUrl.data = connectResp.uri;
      this.logger?.debug('Using QR URI:', connectResp.uri);
      if (this.displayQRCode) this.setQRState(State.Done);
    } catch (error) {
      this.logger?.error('Client connect error: ', error);
      if (this.displayQRCode) this.setQRError(error);
      return;
    }

    if (this.redirect) this.openApp();

    try {
      const session = await connectResp.approval();
      this.logger?.debug('Established session:', session);
      this.sessions.push(session);
      await this._restorePairings();
    } catch (error) {
      this.logger?.error('Session approval error: ', error);
      await this._deleteInactivePairings();
      if (!error) {
        if (this.displayQRCode) this.setQRError(ExpiredError);
        throw new Error('Proposal Expired');
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
    return {};
  }

  async disable(args?: Args.AuthRelated[]): Promise<Resp.Void> {
    if (this.sessions.length === 0) {
      return;
    }

    for (const session of this.sessions) {
      try {
        this.logger?.debug('Delete session:', session);
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
    return {};
  }

  protected async _request(args: ReqArgs): Promise<unknown> {
    const { method, namespace, params } = args;
    const { chainId, params: _params } = params as GeneralParams;
    const prefix = getPrefix(namespace);
    const session = this._getSessionWithMethod(
      prefix,
      chainId as ChainId,
      method
    );

    const resp = await this.signClient.request({
      topic: session.topic,
      chainId: `${prefix}:${chainId}`,
      request: {
        method,
        params: _params,
      },
    });

    return resp;
  }

  async getAccount(args: Args.GetAccount): Promise<Resp.GetAccount> {
    const {
      namespace,
      params: { chainId },
    } = args;
    const sessionAccounts = this._getAccountFromSession(namespace, chainId);

    let raw: Raw;
    let account: Resp.GetAccount['neat']['account'];
    switch (namespace) {
      case 'ethereum':
      case 'everscale':
      case 'stellar':
        account = sessionAccounts;
        break;
      case 'cosmos':
      case 'tezos':
      case 'solana':
      case 'near':
        try {
          raw = await this._getRawList(
            { ...args, params: { chainId, params: {} } },
            'getAccount'
          )[0];

          switch (namespace) {
            case 'cosmos':
            case 'tezos':
              account = (raw.resp as (CosmosAccount | TezosAccount)[]).map(
                (acc) => ({
                  address: acc.address,
                  namespace,
                  chainId,
                  publicKey: {
                    value: acc.pubkey,
                    algo: acc.algo,
                  },
                })
              );
              break;
            case 'solana':
              account = (raw.resp as SolanaAccount[]).map((acc) => ({
                address: acc.pubkey,
                namespace,
                chainId,
                publicKey: acc.pubkey,
              }));
              break;
            case 'near':
              account = (raw.resp as NearAccount[]).map((acc) => ({
                name: acc.accountId,
                namespace,
                chainId,
                publicKey: acc.pubkey,
              }));
              break;
          }
        } catch (error) {
          this.logger.error(error);
          account = sessionAccounts;
        }
        break;
    }
    return { neat: { account }, raw };
  }

  async sign(args: Args.DocRelated<WCTypeParams['sign']>): Promise<Resp.Sign> {
    const raw = await this._sign(args);

    let neat: Resp.Sign['neat'];
    switch (raw.method) {
      case 'cosmos_signDirect':
      case 'cosmos_signAmino':
        const { signature, signed } = raw.resp as
          | SignResult.Cosmos.Direct
          | SignResult.Cosmos.Amino;
        neat = {
          signature: signature.signature,
          publicKey: {
            value: signature.pub_key.value,
            algo: signature.pub_key.type,
          },
          signedDoc: signed,
        };
        break;

      case 'personal_sign':
      case 'eth_sign':
      case 'eth_signTypedData':
      case 'eth_signTransaction':
        neat = { signature: raw.resp as SignResult.Ethereum.PersonalSign };
        break;

      case 'ever_signMessage':
        neat = {
          signedDoc: (raw.resp as SignResult.Everscale.Message)
            .signed_ext_message,
        };
        break;

      case 'ever_sign':
        const {
          signature: everSignature,
          pubkey,
        } = raw.resp as SignResult.Everscale.Sign;
        neat = {
          signature: { value: everSignature, encoding: 'base64' },
          publicKey: pubkey,
        };
        break;

      case 'solana_signTransaction':
      case 'solana_signMessage':
        neat = {
          signature: (raw.resp as SignResult.Solana.Transaction).signature,
        };
        break;

      case 'stellar_signXDR':
        neat = { signedDoc: (raw.resp as SignResult.Stella.XDR).signedXDR };
        break;

      case 'near_signTransaction':
      case 'near_signTransactions':
        neat = { signedDoc: raw.resp as Uint8Array | Uint8Array[] };
        break;

      case 'xrpl_signTransaction':
      case 'xrpl_signTransactionFor':
        const { tx_json } = raw.resp as SignResult.XRPL.Transaction;
        neat = {
          signature: tx_json.TxnSignature,
          publicKey: tx_json.SigningPubKey,
        };
        break;

      default:
        return Promise.reject(`Unmatched method: ${raw.method}.`);
    }
    return { neat, raw };
  }

  async broadcast(
    args: Args.DocRelated<WCTypeParams['broadcast']>
  ): Promise<Resp.Broadcast> {
    const raw = await this._broadcast(args);

    let neat: Resp.Broadcast['neat'];
    switch (raw.method) {
      case 'eth_sendRawTransaction':
        neat = {
          block: {
            hash: raw.resp as SignAndBroadcastResult.Ethereum.Transaction,
          },
        };
        break;
      default:
        return Promise.reject(`Unmatched method: ${raw.method}.`);
    }
    return { neat, raw };
  }

  async signAndBroadcast(
    args: Args.DocRelated<WCTypeParams['signAndBroadcast']>
  ): Promise<Resp.Broadcast> {
    const raw = await this._signAndBroadcast(args);

    let neat: Resp.Broadcast['neat'];
    switch (raw.method) {
      case 'eth_signTransaction':
        neat = {
          block: {
            hash: raw.resp as SignAndBroadcastResult.Ethereum.Transaction,
          },
        };
        break;

      case 'ever_processMessage':
        const { tx_id } = raw.resp as SignAndBroadcastResult.Everscale.Message;
        neat = { block: { hash: tx_id } };
        break;

      case 'stellar_signAndSubmitXDR':
        // raw.resp as SignAndBroadcastResult.Stella.XDR
        neat = {};
        break;

      case 'xrpl_signTransaction':
      case 'xrpl_signTransactionFor':
        const {
          tx_json: { hash },
        } = raw.resp as SignAndBroadcastResult.XRPL.Transaction;
        neat = { block: { hash } };
        break;

      case 'tezos_send':
        const {
          operation_hash,
        } = raw.resp as SignAndBroadcastResult.Tezos.Send;
        neat = { block: { hash: operation_hash } };
        break;

      default:
        return Promise.reject(`Unmatched method: ${raw.method}.`);
    }
    return { neat, raw };
  }

  // restoreLatestSession() {
  //   if (typeof this.signClient === 'undefined') {
  //     await this.init();
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
  //     this.logger?.debug('RESTORED LATEST SESSION:', this.session);
  //   }
  // }
}

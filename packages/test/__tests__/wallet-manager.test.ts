import {
  WalletManager,
  Logger,
  ChainWalletContext,
  DirectSignDoc,
  SuggestTokenTypes,
  Session,
} from '@cosmos-kit/core';
import { chains, assets } from 'chain-registry';
import { Chain } from '@chain-registry/types';
import { MockExtensionWallet } from '../src/mock-extension';
import { mockExtensionInfo as walletInfo } from '../src/mock-extension/extension/registry';
import { getChainWalletContext } from '../../react-lite/src/utils';
import { ORIGIN } from '../src/utils';
import { ACTIVE_WALLET, KeyChain } from '../src/key-chain';
import {
  BrowserStorage,
  BETA_CW20_TOKENS,
  CONNECTIONS,
} from '../src/browser-storage';
import { MockClient } from '../src/mock-extension/extension/client';

import {
  Registry,
  makeAuthInfoBytes,
  makeSignDoc,
  encodePubkey,
  coins,
  makeSignBytes,
} from '@cosmjs/proto-signing';
import { toBase64, fromBase64 } from '@cosmjs/encoding';
import { Secp256k1, Secp256k1Signature, sha256 } from '@cosmjs/crypto';
import { serializeSignDoc } from '@cosmjs/amino';
import { getADR36SignDoc, initActiveWallet } from '../src/utils';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { getMockFromExtension } from '../src/mock-extension/extension/utils';

// Mock global window object
// @ts-ignore
global.window = {
  localStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    key: jest.fn(),
    length: 0,
  },
  // @ts-ignore
  navigator: {
    userAgent:
      "'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'",
  },
  addEventListener: jest.fn(),
};

const logger = new Logger();
function logoutUser() {
  console.log('Session expired. Logging out user.');
  // Code to log out user
}

// Session duration set for 30 minutes
const userSession = new Session({
  duration: 30 * 60 * 1000, // 30 minutes in milliseconds
  callback: logoutUser,
});

// Start the session when the user logs in
userSession.update();

export let walletManager: WalletManager;
let client: MockClient;
let context: ChainWalletContext;

const initChainsCount = 2;

let initialChain: Chain;
let suggestChain: Chain;

const mainWalletBase = new MockExtensionWallet(walletInfo);

beforeAll(async () => {
  const liveChainsOfType118 = chains.filter(
    (chain) => chain.slip44 === 118 && chain.status === 'live'
  );
  const startIndex = liveChainsOfType118.findIndex(
    (chain) => chain.chain_name === 'cosmoshub'
  );

  const endIndex = startIndex + initChainsCount;
  const enabledChains = liveChainsOfType118.slice(startIndex, endIndex);
  initialChain = enabledChains[0];
  suggestChain = liveChainsOfType118[endIndex];

  await initActiveWallet(enabledChains);

  walletManager = new WalletManager(
    enabledChains,
    [mainWalletBase],
    logger,
    true, // throwErrors
    true, // subscribeConnectEvents
    false, // disableIframe
    assets // assetLists
  );
});

describe('WalletManager', () => {
  it('should initialize with provided configurations', () => {
    expect(walletManager.throwErrors).toBe(true);
    expect(walletManager.subscribeConnectEvents).toBe(true);
    expect(walletManager.disableIframe).toBe(false);

    expect(walletManager.chainRecords).toHaveLength(initChainsCount);
    expect(walletManager.walletRepos).toHaveLength(initChainsCount);

    const mainWallet = walletManager.getMainWallet(walletInfo.name);
    expect(mainWallet).toBe(mainWalletBase);
    expect(mainWallet.getChainWalletList(false)).toHaveLength(initChainsCount);
  });

  it('should handle onMounted lifecycle correctly', async () => {
    // `getParser` is a static method of `Bowser` class, unable to mock directly.
    // Mock environment parser
    // jest.mock('Bowser', () => ({
    //   getParser: () => ({
    //     getBrowserName: jest.fn().mockReturnValue('chrome'),
    //     getPlatform: jest.fn().mockReturnValue({ type: 'desktop' }),
    //     getOSName: jest.fn().mockReturnValue('windows'),
    //   }),
    // }));

    await walletManager.onMounted();

    expect(window.addEventListener).toHaveBeenCalledWith(
      walletInfo.connectEventNamesOnWindow[0],
      expect.any(Function)
    );

    expect(window.localStorage.getItem).toHaveBeenCalledWith(
      'cosmos-kit@2:core//current-wallet'
    );

    expect((mainWalletBase.client as MockClient).client).toBe(
      await getMockFromExtension()
    );
  });

  it('should connect wallet', async () => {
    // import { useChain } from "@cosmos-kit/react";
    // mock `useChain` hook

    const walletRepo = walletManager.getWalletRepo(initialChain.chain_name);
    walletRepo.activate();

    const chainWallet = walletManager.getChainWallet(
      initialChain.chain_name,
      walletInfo.name
    );

    expect(walletRepo.isActive).toBe(true);
    expect(chainWallet.isActive).toBe(true);

    context = getChainWalletContext(initialChain.chain_id, chainWallet);

    expect(context.wallet.name).toBe(walletInfo.name);
    expect(context.isWalletDisconnected).toBe(true);

    await chainWallet.connect();

    expect(chainWallet.isWalletConnected).toBe(true);
    expect(chainWallet.address.startsWith(initialChain.bech32_prefix)).toBe(
      true
    );
  });

  it('should suggest chain and addChain', async () => {
    // @ts-ignore
    client = context.chainWallet.client;

    await client.addChain({
      name: suggestChain.chain_name,
      chain: suggestChain,
      assetList: assets.find(
        ({ chain_name }) => chain_name === suggestChain.chain_name
      ),
    });

    const activeWallet = KeyChain.getItem(ACTIVE_WALLET);
    const connections = BrowserStorage.getItem(CONNECTIONS);

    expect(connections[activeWallet.id][suggestChain.chain_id]).toContain(
      ORIGIN
    );

    walletManager.addChains([suggestChain], assets);

    const walletRepos = walletManager.walletRepos;
    const mainWallet = walletManager.getMainWallet(walletInfo.name);
    const chainWalletMap = mainWallet.chainWalletMap;

    expect(walletManager.chainRecords).toHaveLength(initChainsCount + 1);
    expect(walletRepos).toHaveLength(initChainsCount + 1);
    expect(chainWalletMap.size).toBe(initChainsCount + 1);

    const newWalletRepo = walletManager.getWalletRepo(suggestChain.chain_name);
    const newChainWallet = newWalletRepo.getWallet(walletInfo.name);

    expect(newChainWallet.address).toBeFalsy();
    await newChainWallet.connect();
    expect(newChainWallet.address.startsWith(suggestChain.bech32_prefix)).toBe(
      true
    );
  });

  it('should sign direct (using ChainWalletContext)', async () => {
    const registry = new Registry();
    const txBody = {
      messages: [],
      memo: '',
    };
    const txBodyBytes = registry.encodeTxBody(txBody);

    const activeWallet = KeyChain.getItem(ACTIVE_WALLET);
    const address = activeWallet.addresses[initialChain.chain_id];

    const pubKeyBuf = activeWallet.pubKeys[initialChain.chain_id];
    const pubKeyBytes = new Uint8Array(pubKeyBuf);
    const pubkey = encodePubkey({
      type: 'tendermint/PubKeySecp256k1',
      value: toBase64(pubKeyBytes),
    });

    const authInfoBytes = makeAuthInfoBytes(
      [{ pubkey, sequence: 0 }],
      coins(1000, 'ucosm'),
      1000,
      undefined,
      undefined
    );

    const accountNumber = 1;
    const signDoc = makeSignDoc(
      txBodyBytes,
      authInfoBytes,
      initialChain.chain_id,
      accountNumber
    ) as DirectSignDoc;

    const { signature, signed } = await context.signDirect(address, signDoc);

    const valid = await Secp256k1.verifySignature(
      Secp256k1Signature.fromFixedLength(fromBase64(signature.signature)),
      sha256(makeSignBytes(signed)),
      pubKeyBytes
    );

    expect(valid).toBe(true);
  });

  it('should sign amino (using ChainWalletContext)', async () => {
    const activeWallet = KeyChain.getItem(ACTIVE_WALLET);
    const address = activeWallet.addresses[initialChain.chain_id];
    const pubKeyBuf = activeWallet.pubKeys[initialChain.chain_id];

    const signDoc = {
      msgs: [],
      fee: { amount: [], gas: '1000' },
      chain_id: initialChain.chain_id,
      memo: '',
      account_number: '1',
      sequence: '0',
    };

    const { signature, signed } = await context.signAmino(address, signDoc);

    const valid = await Secp256k1.verifySignature(
      Secp256k1Signature.fromFixedLength(fromBase64(signature.signature)),
      sha256(serializeSignDoc(signed)),
      pubKeyBuf
    );

    expect(valid).toBe(true);
  });

  it('should sign arbitrary (using ChainWalletContext)', async () => {
    const data = 'cosmos-kit';

    const activeWallet = KeyChain.getItem(ACTIVE_WALLET);
    const address = activeWallet.addresses[initialChain.chain_id];
    const pubKeyBuf = activeWallet.pubKeys[initialChain.chain_id];

    const { signature, pub_key } = await context.signArbitrary(address, data);

    const signDoc = getADR36SignDoc(
      address,
      Buffer.from(data).toString('base64')
    );
    const valid = await Secp256k1.verifySignature(
      Secp256k1Signature.fromFixedLength(fromBase64(signature)),
      sha256(serializeSignDoc(signDoc)),
      pubKeyBuf
    );

    expect(valid).toBe(true);
    expect(toBase64(pubKeyBuf)).toEqual(pub_key.value);
  });

  it('should getOfflineSignerDirect (using ChainWalletContext)', async () => {
    const offlineSignerDirect = context.getOfflineSignerDirect();
    expect(offlineSignerDirect.signDirect).toBeTruthy();
  });

  it('should getOfflineSignerAmino (using ChainWalletContext)', async () => {
    const offlineSignerAmino = context.getOfflineSignerAmino();
    // @ts-ignore
    expect(offlineSignerAmino.signDirect).toBeFalsy();
    expect(offlineSignerAmino.signAmino).toBeTruthy();
  });

  it('should getOfflineSigner (using ChainWalletContext)', async () => {
    // default preferredSignType - 'amino', packages/core/src/bases/chain-wallet.ts, line 41
    expect(context.chainWallet.preferredSignType).toBe('amino');

    const offlineSigner = context.getOfflineSigner();
    // @ts-ignore
    expect(offlineSigner.signAmino).toBeTruthy();
    // @ts-ignore
    expect(offlineSigner.signDirect).toBeFalsy();
  });

  it('should suggest cw20 token (using ChainWalletContext)', async () => {
    const chainId = 'pacific-1';
    const chainName = 'sei';
    const contractAddress =
      'sei1hrndqntlvtmx2kepr0zsfgr7nzjptcc72cr4ppk4yav58vvy7v3s4er8ed';
    // symbol = 'SEIYAN'

    await context.suggestToken({
      chainId,
      chainName,
      type: SuggestTokenTypes.CW20,
      tokens: [{ contractAddress }],
    });

    const activeWallet = KeyChain.getItem(ACTIVE_WALLET);
    const betaTokens = BrowserStorage.getItem(BETA_CW20_TOKENS);
    const connections = BrowserStorage.getItem(CONNECTIONS);

    expect(connections[activeWallet.id][chainId]).toContain(ORIGIN);
    expect(betaTokens[chainId][contractAddress].coinDenom).toBe('SEIYAN');
  }, 15000); // set timeout to 15 seconds, in case slow network.

  it('should send proto tx (using ChainWalletContext)', async () => {
    const registry = new Registry();

    const activeWallet = KeyChain.getItem(ACTIVE_WALLET);
    const address = activeWallet.addresses[initialChain.chain_id];

    const coin = Coin.fromPartial({ denom: 'ucosm', amount: '1000' });
    const msgSend = MsgSend.fromPartial({
      fromAddress: address,
      toAddress: 'archway1qypqxpq9qcrsszg2pvxq6rs0zqg3yyc52fs6vt',
      amount: [coin],
    });
    const message = { typeUrl: '/cosmos.bank.v1beta1.MsgSend', value: msgSend };
    const txBody = { messages: [message], memo: '' };
    const txBodyBytes = registry.encodeTxBody(txBody);

    const pubKeyBuf = activeWallet.pubKeys[initialChain.chain_id];
    const pubKeyBytes = new Uint8Array(pubKeyBuf);
    const pubkey = encodePubkey({
      type: 'tendermint/PubKeySecp256k1',
      value: toBase64(pubKeyBytes),
    });

    const authInfoBytes = makeAuthInfoBytes(
      [{ pubkey, sequence: 0 }],
      coins(1000, 'ucosm'),
      1000,
      undefined,
      undefined
    );

    const accountNumber = 1;
    const signDoc = makeSignDoc(
      txBodyBytes,
      authInfoBytes,
      initialChain.chain_id,
      accountNumber
    ) as DirectSignDoc;

    const { signature, signed } = await context.signDirect(address, signDoc);

    const txRaw = TxRaw.fromPartial({
      bodyBytes: signed.bodyBytes,
      authInfoBytes: signed.authInfoBytes,
      signatures: [fromBase64(signature.signature)],
    });
    const txRawBytes = Uint8Array.from(TxRaw.encode(txRaw).finish());

    // `BroadcastMode.SYNC` There is a problem with enum definition at runtime.
    // @ts-expect-error
    const result = await context.sendTx(txRawBytes, 'sync');

    // since this is a mock tx, the tx will not succeed, but we will still get a response with a txhash.
    expect(toBase64(result)).toHaveLength(64);
  }, 15000); // set timeout to 15 seconds, in case slow network.
});

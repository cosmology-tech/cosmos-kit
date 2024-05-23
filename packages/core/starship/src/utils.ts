// @ts-nocheck
import { ChainInfo } from '@chain-registry/client';
import { Bip39, Random } from '@cosmjs/crypto';
import { Coin, DirectSecp256k1HdWallet, OfflineSigner } from '@cosmjs/proto-signing';
import BigNumber from 'bignumber.js';
import { ConfigContext, useChain } from 'starshipjs';

export function generateMnemonic(): string {
  return Bip39.encode(Random.getBytes(16)).toString();
}

export const calcShareOutAmount = (poolInfo, coinsNeeded) => {
  return poolInfo.poolAssets
    .map(({ token }, i) => {
      const tokenInAmount = new BigNumber(coinsNeeded[i].amount);
      const totalShare = new BigNumber(poolInfo.totalShares.amount).shiftedBy(-18);
      const poolAssetAmount = new BigNumber(token.amount);

      return tokenInAmount
        .multipliedBy(totalShare)
        .dividedBy(poolAssetAmount)
        .shiftedBy(18)
        .decimalPlaces(0, BigNumber.ROUND_HALF_UP)
        .toString();
    })
    .sort((a, b) => (new BigNumber(a).lt(b) ? -1 : 1))[0];
};

export const waitUntil = (date, timeout = 90000) => {
  const delay = date.getTime() - Date.now();
  if (delay > timeout) {
    throw new Error('Timeout to wait until date');
  }
  return new Promise((resolve) => setTimeout(resolve, delay + 3000));
};

const createTempWallet = async (bech32Prefix: string) => {
  return DirectSecp256k1HdWallet.fromMnemonic(generateMnemonic(), { prefix: bech32Prefix });
};

export const createCosmJSWallet = async (chainInfo: ChainInfo): Promise<OfflineSigner> => {
  const wallet = await createTempWallet(chainInfo.bech32_prefix);
  return wallet;
};

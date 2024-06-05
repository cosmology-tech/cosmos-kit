import { cdcwalletExtensionInfo, CdcwalletExtensionWallet } from './extension';

const cdcwalletExtension = new CdcwalletExtensionWallet(cdcwalletExtensionInfo);

export const wallets = [cdcwalletExtension];

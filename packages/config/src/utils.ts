import { WalletName } from '@cosmos-kit/core';
import { walletRecords } from './wallet';

export function getWalletPrettyName(name?: WalletName) {
    if (!name) {
        return undefined;
    }
    return walletRecords.find(v => v.name === name)?.prettyName;
}
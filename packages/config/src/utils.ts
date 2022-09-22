import { WalletName } from '@cosmos-kit/core';
import { wallets } from './wallet';

export function getWalletPrettyName(name?: WalletName) {
    if (!name) {
        return undefined;
    }
    return wallets.find(v => v.name === name)?.prettyName;
}
import { WalletName } from '@cosmos-kit/core';
import { allWallets } from './config';

export function getWalletPrettyName(name?: WalletName) {
    if (!name) {
        return undefined;
    }
    return allWallets.find(v => v.name === name)?.prettyName;
}
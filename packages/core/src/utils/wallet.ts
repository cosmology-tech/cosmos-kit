import { WalletName } from "../types";
import { allWallets } from '@cosmos-kit/registry';

export function getWalletPrettyName(name?: WalletName) {
    if (!name) {
        return undefined;
    }
    return allWallets.find(v => v.name === name)?.prettyName;
}
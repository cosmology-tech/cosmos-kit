import { Wallet } from '@cosmos-kit/core';
import { WCClient } from '@cosmos-kit/walletconnect';

declare class KeplrClient extends WCClient {
    constructor(walletInfo: Wallet);
}

export { KeplrClient };

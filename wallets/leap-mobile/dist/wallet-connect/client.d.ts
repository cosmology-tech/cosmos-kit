import { Wallet } from '@cosmos-kit/core';
import { WCClient } from '@cosmos-kit/walletconnect';

declare class LeapClient extends WCClient {
    constructor(walletInfo: Wallet);
}

export { LeapClient };

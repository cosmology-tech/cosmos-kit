import { Wallet } from '@cosmos-kit/core';
import { WCClient } from '@cosmos-kit/walletconnect';

declare class CosmostationClient extends WCClient {
    constructor(walletInfo: Wallet);
}

export { CosmostationClient };

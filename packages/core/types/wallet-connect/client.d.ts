import WalletConnect from '@walletconnect/client';
import { IPushServerOptions, IWalletConnectOptions } from '@walletconnect/types';
import { OS } from '..';
export declare abstract class WalletConnectClient {
    readonly connector: WalletConnect;
    constructor(connectorOpts?: IWalletConnectOptions, pushServerOpts?: IPushServerOptions);
    get qrUrl(): string;
    abstract getAppUrl(os: OS): string | undefined;
}

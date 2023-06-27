import { Algo } from '@cosmjs/proto-signing';
import { Keplr } from '@keplr-wallet/types';

interface CosmostationSignOptions {
    readonly preferNoSetFee?: boolean;
    readonly preferNoSetMemo?: boolean;
    readonly disableBalanceCheck?: boolean;
}
interface Request {
    method: string;
    params?: object;
}
interface Cosmos {
    request(request: Request): Promise<any>;
    on(type: string, listener: EventListenerOrEventListenerObject): Event;
    off(event: Event): void;
}
interface Cosmostation {
    cosmos: Cosmos;
    providers: {
        keplr: Keplr;
    };
}
declare type RequestAccountResponse = {
    name: string;
    address: string;
    publicKey: Uint8Array;
    isLedger: boolean;
    algo: Algo;
};

export { Cosmos, Cosmostation, CosmostationSignOptions, Request, RequestAccountResponse };

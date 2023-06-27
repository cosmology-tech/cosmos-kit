import { Shell } from './types';
import { OfflineAminoSigner } from '@cosmjs/amino';
import { OfflineDirectSigner } from '@cosmjs/proto-signing';
import { SecretUtils } from 'secretjs/types/enigmautils';
export interface ShellWindow {
    shellwallet?: Shell;
    getOfflineSigner?: (chainId: string) => OfflineAminoSigner & OfflineDirectSigner;
    getOfflineSignerOnlyAmino?: (chainId: string) => OfflineAminoSigner;
    getOfflineSignerAuto?: (chainId: string) => Promise<OfflineAminoSigner | OfflineDirectSigner>;
    getEnigmaUtils?: (chainId: string) => SecretUtils;
}
export declare const getShellFromExtension: () => Promise<Shell | undefined>;

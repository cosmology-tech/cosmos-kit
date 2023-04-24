import { stationExtensionInfo, StationExtensionWallet } from './extension';

const stationExtension = new StationExtensionWallet(stationExtensionInfo);

export const wallets = [stationExtension];

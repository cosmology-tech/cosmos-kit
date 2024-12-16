import { GatewalletExtensionInfo, GatewalletExtensionWallet } from './extension';

const gatewalletExtension = new GatewalletExtensionWallet(GatewalletExtensionInfo);

export const wallets = [gatewalletExtension];

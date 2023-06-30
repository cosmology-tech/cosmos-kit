import * as ReactLite from '@cosmos-kit/react-lite';
import { WalletModal } from './modal';
import { ChainProvider } from './provider';
// export {
//   useChain,
//   useChainWallet,
//   useManager,
//   useNameService,
//   useWallet,
//   useWalletClient,
//   walletContext,
// } from '@cosmos-kit/react-lite';
//
export { WalletModal };
export { ChainProvider };
// export { DefaultModal, WalletModal } from './modal';
// export { ChainProvider } from './provider';

export const useChain = ReactLite.useChain;
export const useChainWallet = ReactLite.useChainWallet;
export const useManager = ReactLite.useManager;
export const useNameService = ReactLite.useNameService;
export const useWallet = ReactLite.useWallet;
export const useWalletClient = ReactLite.useWalletClient;
export const walletContext = ReactLite.walletContext;

import { ChainContext, ChainName, ManagerContext, Mutable, NameService, NameServiceName, ModalThemeContext } from '@cosmos-kit/core';
export declare const useModalTheme: () => ModalThemeContext;
export declare const useManager: () => ManagerContext;
export declare const useNameService: (name?: NameServiceName) => Mutable<NameService>;
export declare const useChain: (chainName: ChainName) => ChainContext;

import type { OfflineSigner } from "@cosmjs/proto-signing";
import {
  Wallet,
  MainWalletBase,
  ChainWalletBase,
  ChainRecord,
  WalletClient,
  SimpleAccount,
  ClientNotExistError,
  WalletAccount,
} from "@cosmos-kit/core";
import type { TailwindWallet } from "@tailwindzone/connect";

export const ICON =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiByeD0iMzYiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8xMV8yNikiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xODguNzMzIDE0Mi43NEMyMTUuOTMzIDEyMS4xOTcgMjc5Ljk2NyAxMTkuNDk2IDI3Ni4zODUgMTYzLjU5MkgyNzYuMzk3QzI3My4xNjcgMjAzLjk2OSAyMzIuOTMzIDI0My42NTQgMTkxLjU2NyAyNzJINzJDMTUzLjYgMjQxLjM4NiAyMTQuMjc5IDE4MC40NjQgMTg4LjczMyAxNDIuNzRaTTI4My4zNjcgMjA3LjM3QzI3Mi42IDIzMC4wNDcgMjUxLjkxNyAyNTEuODE3IDIyNSAyNzJIMjg3LjlDMjk1LjgzMyAyNjUuMTk3IDMxMCAyNDguNzU2IDMxMCAyMzMuNDQ5QzMxMCAyMTguNzA5IDMwMC45MzMgMjEwLjIwNSAyODMuMzY3IDIwNy4zN1oiIGZpbGw9IndoaXRlIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMTFfMjYiIHgxPSIyMDAiIHkxPSIwIiB4Mj0iMjAwIiB5Mj0iNDAwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiMzODAxQTUiLz4KPHN0b3Agb2Zmc2V0PSIxIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==";

export const tailwind_extension_info: Wallet = {
  name: "tailwind-extension",
  prettyName: "TAILWIND",
  mode: "extension",
  mobileDisabled: true,
  logo: ICON,
};

/**
 * Keplr and leap both leave this interface empty.
 * Used in TailwindExtensionWallet's instantiation.
 */
export class ChainTailwindExtension extends ChainWalletBase {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }
}

export class TailwindClient implements WalletClient {
  constructor(private tailwind: TailwindWallet) {
    this.tailwind = tailwind;
  }

  async getAccount(chainId: string): Promise<WalletAccount> {
    const signer = await this.tailwind.getOfflineSigner(chainId);
    const [acc] = await signer.getAccounts();
    return {
      algo: acc.algo,
      address: acc.address,
      pubkey: acc.pubkey,
    };
  }

  async getSimpleAccount(chainId: string): Promise<SimpleAccount> {
    const signer = await this.tailwind.getOfflineSigner(chainId);
    const [acc] = await signer.getAccounts();
    return {
      chainId,
      namespace: "tailwind-wallet",
      address: acc.address,
    };
  }

  async getOfflineSigner(chainId: string): Promise<OfflineSigner> {
    return this.tailwind.getOfflineSigner(chainId);
  }

  async enable(): Promise<void> { }
}

export const getWalletFromWindow: () => Promise<
  TailwindWallet | undefined
> = async () => {
  if (typeof window === "undefined") {
    return void 0;
  }
  const tailwind = window.tailwind;

  if (tailwind) {
    return tailwind;
  }

  if (document.readyState === "complete") {
    if (tailwind) {
      return tailwind;
    } else {
      throw ClientNotExistError;
    }
  }

  return new Promise((resolve, reject) => {
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === "complete"
      ) {
        if (tailwind) {
          resolve(tailwind);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener("readystatechange", documentStateChange);
      }
    };

    document.addEventListener("readystatechange", documentStateChange);
  });
};

export class TailwindExtensionWallet extends MainWalletBase {
  constructor(wallet_info: Wallet) {
    super(wallet_info, ChainTailwindExtension);
  }

  async initClient(options?: any): Promise<void> {
    this.initingClient();
    try {
      const tailwind = await getWalletFromWindow();
      this.initClientDone(tailwind ? new TailwindClient(tailwind) : undefined);
    } catch (err) {
      this.initClientError(err as Error);
    }
  }
}

export const wallets: MainWalletBase[] = [
  new TailwindExtensionWallet(tailwind_extension_info),
];

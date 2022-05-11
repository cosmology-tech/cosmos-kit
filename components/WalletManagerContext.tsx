import WalletConnect from "@walletconnect/client";
import EventEmitter from "eventemitter3";
import React, {
  createContext,
  FunctionComponent,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { ModalClassNames, SelectWalletModal, WalletConnectQRCodeModal } from ".";

export interface WalletInfo {
  id: string;
  name: string;
  description: string;
  logoImgUrl: string;
  getWallet: (connector?: WalletConnect) => Promise<any>;
}

export const WalletManagerContext = createContext<{
  getWallet: () => Promise<any>;
  clearLastUsedWallet: () => void;
  setDefaultConnectionType: (type: string | undefined) => void;
  connectionType?: string | undefined;
} | null>(null);

export const WalletManagerProvider: FunctionComponent<{
  walletInfoList: WalletInfo[];
  children: ReactNode;
  classNames?: ModalClassNames;
}> = ({ walletInfoList, children, classNames }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wcUri, setWCUri] = useState("");

  const lastUsedWalletRef = useRef<any>();
  const defaultConnectionTypeRef = useRef<string | undefined>();
  const [connectionType, setConnectionType] = useState<string | undefined>();
  const [eventListener] = useState(() => new EventEmitter());

  const [getWallet] = useState(() => (): Promise<any> => {
    if (typeof window === "undefined") {
      return Promise.resolve(undefined);
    }

    if (lastUsedWalletRef.current) {
      return Promise.resolve(lastUsedWalletRef.current);
    }

    const cleanUp = () => {
      eventListener.off("modal_close");
      eventListener.off("wc_qr_modal_close");
      walletInfoList.forEach((walletInfo) => {
        eventListener.off(walletInfo.id);
      });
    };

    let callbackClosed: (() => void) | undefined;

    const wcConnector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org",
      signingMethods: [
        "keplr_enable_wallet_connect_v1",
        "keplr_sign_amino_wallet_connect_v1",
      ],
      qrcodeModal: {
        open: (uri: string, cb: any) => {
          setWCUri(uri);
          callbackClosed = cb;
        },
        close: () => setWCUri(""),
      },
    });

    const resolveWallet = async (
      walletInfo: WalletInfo,
      resolver?: (value: any) => void
    ) => {
      const wallet = await walletInfo.getWallet(wcConnector);
      lastUsedWalletRef.current = wallet;
      setConnectionType(walletInfo.id);
      eventListener.off("modal_close");
      eventListener.off("wc_qr_modal_close");
      return resolver ? resolver(wallet) : Promise.resolve(wallet);
    };

    const defaultConnectionWalletInfo = walletInfoList.find(
      (walletInfo) => defaultConnectionTypeRef.current === walletInfo.id
    );
    if (defaultConnectionWalletInfo) {
      return resolveWallet(defaultConnectionWalletInfo);
    }

    return new Promise((resolve, reject) => {
      setIsModalOpen(true);

      eventListener.on("modal_close", () => {
        setIsModalOpen(false);
        reject();
        cleanUp();
      });

      eventListener.on("wc_qr_modal_close", () => {
        setWCUri("");
        if (callbackClosed) {
          callbackClosed();
        }
      });

      walletInfoList.forEach((walletInfo) => {
        eventListener.on(walletInfo.id, async () => {
          setIsModalOpen(false);

          if (walletInfo.id.startsWith("walletconnect")) {
            if (!wcConnector.connected) {
              wcConnector.createSession();

              wcConnector.on("connect", (error: any) => {
                if (error) {
                  reject(error);
                } else {
                  resolveWallet(walletInfo, resolve);
                }
              });
            } else {
              resolveWallet(walletInfo, resolve);
            }
          } else {
            resolveWallet(walletInfo, resolve);
          }
        });
      });
    });
  });

  return (
    <WalletManagerContext.Provider
      value={{
        getWallet,
        clearLastUsedWallet: useCallback(() => {
          lastUsedWalletRef.current = undefined;
          setConnectionType(undefined);
        }, []),
        setDefaultConnectionType: useCallback((type: string | undefined) => {
          defaultConnectionTypeRef.current = type;
        }, []),
        connectionType,
      }}
    >
      <SelectWalletModal
        isOpen={isModalOpen}
        onRequestClose={() => {
          eventListener.emit("modal_close");
        }}
        wallets={walletInfoList}
        selectWallet={(walletId: string) => {
          eventListener.emit(walletId);
        }}
        classNames={classNames}
      />
      <WalletConnectQRCodeModal
        isOpen={wcUri.length > 0}
        onRequestClose={() => eventListener.emit("wc_qr_modal_close")}
        uri={wcUri}
        classNames={classNames}
      />
      {children}
    </WalletManagerContext.Provider>
  );
};

export const useWalletManager = () => {
  const context = useContext(WalletManagerContext);
  if (!context) {
    throw new Error("You forgot to use WalletManagerProvider");
  }

  return context;
};

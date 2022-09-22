import { WalletManager } from "@cosmos-kit/core";
import { WalletRecordType } from "../types";
export declare const getModalHead: (walletManager: WalletManager, currentWalletData: WalletRecordType, handleClose: () => void, modalReset: boolean, setModalReset: (v: boolean) => void) => JSX.Element;

import React, { FunctionComponent } from "react";
import { BaseModal, BaseModalProps } from "./BaseModal";

export interface Wallet {
  id: string;
  name: string;
  description: string;
  logoImgUrl: string;
}

export const SelectWalletModal: FunctionComponent<
  BaseModalProps & {
    wallets: Wallet[];
    selectWallet: (walletId: string) => void;
  }
> = ({ isOpen, onRequestClose, wallets, selectWallet }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      title="Select a wallet"
    >
      <div className="flex flex-col gap-4">
        {wallets.map((wallet) => (
          <button
            className="bg-background rounded-2xl p-5 flex items-center bg-gray-200 dark:bg-gray-800 ring-1 ring-gray-400 hover:ring-gray-600 dark:ring-gray-600 dark:hover:ring-gray-400"
            onClick={(e) => {
              e.preventDefault();
              selectWallet(wallet.id);
            }}
          >
            <img
              src={wallet.logoImgUrl}
              alt="keplr logo"
              className="w-16 h-16"
            />
            <div className="flex flex-col text-left ml-5">
              <h4 className="text-black dark:text-gray-200 text-lg font-semibold">
                {wallet.name}
              </h4>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                {wallet.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </BaseModal>
  );
};

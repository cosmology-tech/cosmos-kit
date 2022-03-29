import React, { FunctionComponent } from "react";
import { BaseModal, BaseModalProps } from "./BaseModal";

export const KeplrConnectionSelectModal: FunctionComponent<
  BaseModalProps & {
    onSelectExtension: () => void;
    onSelectWalletConnect: () => void;
  }
> = ({ isOpen, onRequestClose, onSelectExtension, onSelectWalletConnect }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="max-w-[30.625rem]"
      title={<h6 className="mt-1 mb-4">Connect Wallet</h6>}
    >
      <button
        className="bg-background rounded-2xl p-5 flex items-center"
        onClick={(e) => {
          e.preventDefault();
          onSelectExtension();
        }}
      >
        <img src="/keplr-logo.png" alt="keplr logo" className="w-16 h-16" />
        <div className="flex flex-col text-left ml-5">
          <h6>Keplr Wallet</h6>
          <p className="body2 text-iconDefault mt-1">Keplr Browser Extension</p>
        </div>
      </button>
      <button
        className="bg-background rounded-2xl p-5 flex items-center mt-5"
        onClick={(e) => {
          e.preventDefault();
          onSelectWalletConnect();
        }}
      >
        <img
          src="/wallet-connect-logo.png"
          alt="wallet connect logo"
          className="w-16 h-16"
        />
        <div className="flex flex-col text-left ml-5">
          <h6>WalletConnect</h6>
          <p className="body2 text-iconDefault mt-1">Keplr Mobile</p>
        </div>
      </button>
    </BaseModal>
  );
};

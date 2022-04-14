import QRCode from "qrcode.react";
import React, { FunctionComponent } from "react";
import { BaseModal, BaseModalProps } from "./BaseModal";

export const WalletConnectQRCodeModal: FunctionComponent<
  BaseModalProps & {
    uri: string;
  }
> = ({ isOpen, onRequestClose, uri }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      title="Scan QR code"
      maxWidth="24rem"
    >
      {uri ? (
        <QRCode
          style={{ width: "100%", height: "100%" }}
          size={500}
          value={uri}
        />
      ) : undefined}
    </BaseModal>
  );
};

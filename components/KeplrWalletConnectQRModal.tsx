import React, { FunctionComponent } from "react";
import { BaseModal, BaseModalProps } from "./BaseModal";
import QRCode from "qrcode.react";

export const KeplrWalletConnectQRModal: FunctionComponent<
  BaseModalProps & {
    uri: string;
  }
> = ({ isOpen, onRequestClose, uri }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="max-w-[35.5rem]"
      title={<h5 className="mb-4">Scan QR Code</h5>}
    >
      {uri ? (
        <div className="bg-white-high p-3.5">
          <QRCode size={500} value={uri} />
        </div>
      ) : undefined}
    </BaseModal>
  );
};

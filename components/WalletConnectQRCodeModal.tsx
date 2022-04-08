import { FunctionComponent } from "react";
import { BaseModal, BaseModalProps } from "./BaseModal";
import QRCode from "qrcode.react";

export const WalletConnectQRCodeModal: FunctionComponent<
  BaseModalProps & {
    uri: string;
  }
> = ({ isOpen, onRequestClose, uri }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="max-w-wc-modal"
      title="Scan QR code"
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

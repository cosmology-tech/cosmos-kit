import {
  SimpleModalHead,
  QRCode as SimpleQRCode,
  SimpleModalView,
  QRCodeStatus,
} from '@cosmology-ui/react';
import { ExpiredError, State, WalletViewProps } from '@cosmos-kit/core';
import React, { useCallback, useMemo } from 'react';

export const QRCodeView = ({ onClose, onReturn, wallet }: WalletViewProps) => {
  const {
    walletInfo: { prettyName },
    qrUrl: { data, state, message },
  } = wallet;

  const [desc, errorTitle, errorDesc, status] = useMemo(() => {
    let desc: string = `Open ${prettyName} App to Scan`;
    let errorTitle: string, errorDesc: string;
    if (state === 'Error') {
      desc = void 0;
      if (message === ExpiredError.message) {
        errorTitle = 'QRCode Expired';
        errorDesc = 'Click to refresh.';
      } else {
        errorTitle = 'QRCode Error';
        errorDesc = message;
      }
    }

    let status: QRCodeStatus;
    switch (state) {
      case State.Pending:
        status = QRCodeStatus.Pending;
        break;
      case State.Done:
        status = QRCodeStatus.Done;
        break;
      case State.Error:
        if (message === ExpiredError.message) {
          status = QRCodeStatus.Expired;
        } else {
          status = QRCodeStatus.Error;
        }
        break;
      default:
        status = QRCodeStatus.Error;
    }

    return [desc, errorTitle, errorDesc, status];
  }, [state, message]);

  const onRefresh = useCallback(() => {
    wallet.connect(false);
  }, [wallet]);

  const modalHead = (
    <SimpleModalHead
      title={prettyName}
      backButton={true}
      onClose={onClose}
      onBack={onReturn}
    />
  );

  const modalContent = (
    <SimpleQRCode
      link={data || ''}
      description={desc}
      errorTitle={errorTitle}
      errorDesc={errorDesc}
      onRefresh={onRefresh}
      status={status}
    />
  );

  return <SimpleModalView modalHead={modalHead} modalContent={modalContent} />;
};

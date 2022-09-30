import { WalletManager } from '@cosmos-kit/core';
import React from 'react';

import { ModalHead } from '../components';
import { WalletRecordType } from '../types';

export const getModalHead = (
  walletManager: WalletManager,
  currentWalletData: WalletRecordType | undefined,
  handleClose: () => void,
  modalReset: boolean,
  setModalReset: (v: boolean) => void
) => {
  function onBack() {
    setModalReset(true);
  }

  if (currentWalletData && !modalReset) {
    return (
      <ModalHead
        title={currentWalletData.walletName || currentWalletData.id}
        backButton={true}
        onClose={handleClose}
        onBack={onBack}
      />
    );
  } else {
    return (
      <ModalHead
        title="Select a Wallet"
        backButton={false}
        onClose={handleClose}
      />
    );
  }
};

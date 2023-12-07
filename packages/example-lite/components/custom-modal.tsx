import { WalletModalProps } from "@cosmos-kit/core";
import React from "react";
import { Button, Modal, Stack } from "react-bootstrap";

export const CustomModal = ({
  isOpen,
  setOpen,
  walletRepo,
}: WalletModalProps) => {
  const onCloseModal = () => {
    setOpen(false);
  };

  const onConnect = (connect: () => Promise<void>) => {
    connect?.();
    onCloseModal();
  };

  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={isOpen} onHide={onCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Choose Wallet</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Stack gap={3}>
            {walletRepo?.wallets.map(
              ({ walletName, connect, walletInfo, walletStatus }) => (
                <Button key={walletName} onClick={() => onConnect(connect)}>
                  {walletInfo.prettyName} - {walletStatus}
                </Button>
              )
            )}
          </Stack>
        </Modal.Body>
      </Modal>
    </div>
  );
};

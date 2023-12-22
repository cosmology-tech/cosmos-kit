import { WalletModalProps, WalletStatus } from "@cosmos-kit/core";
import React from "react";
import { Badge, Button, Modal, Stack } from "react-bootstrap";

export const CustomModal = ({
  isOpen,
  setOpen,
  walletRepo,
}: WalletModalProps) => {
  const onCloseModal = () => {
    setOpen(false);
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
              ({
                walletName,
                connect,
                disconnect,
                walletInfo,
                walletStatus,
                message,
              }) => {
                let button;
                switch (walletStatus) {
                  case WalletStatus.Disconnected:
                    button = <Button onClick={() => connect()}>Connect</Button>;
                    break;
                  case WalletStatus.NotExist:
                    button = <Button>Install</Button>;
                    break;
                  case WalletStatus.Connected:
                    button = (
                      <Button onClick={() => disconnect()}>Disconnect</Button>
                    );
                    break;
                  case WalletStatus.Error:
                    button = (
                      <div className="p-2 text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-3">
                        {message}
                      </div>
                    );
                    break;
                }
                return (
                  <Stack key={walletName} direction="horizontal" gap={3}>
                    <div className="p-2">
                      {walletInfo.prettyName} - {walletStatus}
                    </div>
                    <div className="p-2 ms-auto"> {button}</div>
                  </Stack>
                );
              }
            )}
          </Stack>
        </Modal.Body>
      </Modal>
    </div>
  );
};

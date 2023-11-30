import { WalletModalProps } from "@cosmos-kit/core";
import { BasicModal, Button } from "@interchain-ui/react";

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
    <BasicModal isOpen={isOpen} onClose={onCloseModal} title={"Choose Wallet"}>
      {walletRepo?.wallets.map(
        ({ walletName, connect, walletInfo, walletStatus }) => (
          <Button key={walletName} onClick={() => onConnect(connect)}>
            {walletInfo.prettyName} - {walletStatus}
          </Button>
        )
      )}
    </BasicModal>
  );
};

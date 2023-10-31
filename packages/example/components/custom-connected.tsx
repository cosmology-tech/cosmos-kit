import { WalletViewProps } from "@cosmos-kit/core";
import { ModalViewImpl } from "@cosmos-kit/react";

export function CustomConnectedView(props: WalletViewProps): ModalViewImpl {
  const { onClose, wallet } = props;

  const {
    walletInfo: { prettyName },
    username,
  } = wallet;

  const header = (
    <div
      className="ep-wallet-modal__header w-100 d-flex align-items-center justify-content-between px-3 py-4"
      data-cy="ep-wallet-modal-header"
    >
      Hello I'm a custom component
    </div>
  );
  const body = (
    <div
      className="ep-wallet-modal ep-br-16 d-flex flex-column"
      data-cy="ep-wallet-modal"
    >
      <div
        className="ep-wallet-modal__body w-100 ep-p-top-bottom-32 px-4"
        data-cy="ep-wallet-modal-body"
      >
        <p className="ep-text-color-white m-0">
          {prettyName} <b>{username}</b> account is successfully connected
        </p>
      </div>
    </div>
  );

  return {
    head: header,
    content: body,
  };
}

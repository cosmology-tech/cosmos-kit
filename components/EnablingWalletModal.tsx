import React, { FunctionComponent, ReactNode, useEffect, useState } from "react"

import { BaseModal, BaseModalProps } from "./BaseModal"

export const EnablingWalletModal: FunctionComponent<
  BaseModalProps & { renderLoader?: () => ReactNode; reset: () => void }
> = ({ isOpen, classNames, renderLoader, reset, ...props }) => {
  const [showHelp, setShowHelp] = useState(false)
  // Show help if timeout is reached.
  useEffect(() => {
    if (!isOpen) {
      setShowHelp(false)
      return
    }

    const timeout = setTimeout(() => setShowHelp(true), 5000)
    return () => clearTimeout(timeout)
  }, [isOpen, setShowHelp])

  return (
    <BaseModal
      classNames={classNames}
      isOpen={isOpen}
      maxWidth="24rem"
      title="Enabling Wallet..."
      {...props}
    >
      {showHelp && (
        <p className={classNames?.textContent}>
          If nothing shows up in your wallet,{" "}
          <button
            onClick={reset}
            style={{ textDecoration: "underline", display: "inline" }}
          >
            click here to reset
          </button>{" "}
          and try connecting again. Refresh the page if the problem persists.
        </p>
      )}

      {renderLoader && <div className="mt-4">{renderLoader()}</div>}
    </BaseModal>
  )
}

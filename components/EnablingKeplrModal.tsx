import React, { FunctionComponent, ReactNode, useEffect, useState } from "react"

import { BaseModal, BaseModalProps } from "./BaseModal"

export const EnablingKeplrModal: FunctionComponent<
  BaseModalProps & { renderContent?: () => ReactNode; reset: () => void }
> = ({ isOpen, classNames, renderContent, reset, ...props }) => {
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
      title="Enabling Keplr..."
      {...props}
    >
      {showHelp && (
        <p className={classNames?.textContent}>
          If nothing is showing up in your wallet,{" "}
          <button
            onClick={reset}
            style={{ textDecoration: "underline", display: "inline" }}
          >
            click here to reset
          </button>{" "}
          and try to connect again.
        </p>
      )}

      {renderContent?.()}
    </BaseModal>
  )
}

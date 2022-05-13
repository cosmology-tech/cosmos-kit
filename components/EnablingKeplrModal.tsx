import React, { FunctionComponent, ReactNode, useEffect, useState } from "react"

import { BaseModal, BaseModalProps } from "./BaseModal"

export const EnablingKeplrModal: FunctionComponent<
  BaseModalProps & { renderContent?: () => ReactNode }
> = ({ isOpen, classNames, renderContent, ...props }) => {
  // Show help if timeout is reached.
  const [showHelp, setShowHelp] = useState(false)
  useEffect(() => {
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
          If nothing is showing up in your mobile wallet,{" "}
          <button
            onClick={() => window.location.reload()}
            style={{ textDecoration: "underline", display: "inline" }}
          >
            refresh the page
          </button>{" "}
          and try to connect again.
        </p>
      )}

      {renderContent?.()}
    </BaseModal>
  )
}

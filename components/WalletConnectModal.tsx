import {
  isAndroid as checkIsAndroid,
  isMobile as checkIsMobile,
} from "@walletconnect/browser-utils"
import QRCode from "qrcode.react"
import React, { FunctionComponent, useEffect, useMemo, useState } from "react"

import { BaseModal, BaseModalProps, ModalSubheader } from "./BaseModal"

const IOS_KEPLR_MOBILE_URL = "itms-apps://itunes.apple.com/app/1567851089"

export const WalletConnectModal: FunctionComponent<
  BaseModalProps & {
    uri?: string
    reset: () => void
  }
> = ({ isOpen, uri, classNames, reset, ...props }) => {
  const isMobile = useMemo(() => checkIsMobile(), [])
  const isAndroid = useMemo(() => checkIsAndroid(), [])

  // Defined if isMobile is true.
  const navigateToAppURL = useMemo(
    () =>
      isMobile
        ? isAndroid
          ? `intent://wcV1?${uri}#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;`
          : `keplrwallet://wcV1?${uri}`
        : undefined,
    [isMobile, isAndroid, uri]
  )

  // Open app if mobile URL is available.
  useEffect(() => {
    if (!isOpen || !navigateToAppURL) return

    // Slight delay so they can read the modal.
    const timeout = setTimeout(() => {
      window.location.href = navigateToAppURL
    }, 2000)

    return () => clearTimeout(timeout)
  }, [navigateToAppURL, isOpen])

  const [qrShowing, setQrShowing] = useState(!isMobile)

  // Show mobile help if timeout is reached.
  const [showMobileHelp, setShowMobileHelp] = useState(false)
  useEffect(() => {
    if (!isMobile || !isOpen) {
      setShowMobileHelp(false)
      return
    }

    const timeout = setTimeout(() => setShowMobileHelp(true), 5000)
    return () => clearTimeout(timeout)
  }, [isOpen, isMobile, setShowMobileHelp])

  return (
    <BaseModal
      classNames={classNames}
      isOpen={isOpen}
      maxWidth="24rem"
      title={isMobile ? "Connect to Mobile Wallet" : "Scan QR Code"}
      {...props}
    >
      {!!navigateToAppURL && (
        <>
          <p
            className={classNames?.textContent}
            style={{ marginBottom: showMobileHelp ? "1rem" : "1.5rem" }}
          >
            <a href={navigateToAppURL} style={{ textDecoration: "underline" }}>
              Open your mobile wallet
            </a>{" "}
            and accept the connection request.
          </p>

          <p
            className={classNames?.textContent}
            style={{ marginBottom: showMobileHelp ? "1rem" : "1.5rem" }}
          >
            If you don&apos;t have Keplr Mobile installed,{" "}
            <a
              href={isAndroid ? navigateToAppURL : IOS_KEPLR_MOBILE_URL}
              style={{ textDecoration: "underline" }}
            >
              click here to install it
            </a>
            . You can also scan the QR code at the bottom from another device
            with Keplr Mobile installed.
          </p>

          {showMobileHelp && (
            <p
              className={classNames?.textContent}
              style={{ marginBottom: "1.5rem" }}
            >
              If nothing shows up in your mobile wallet, or nothing happened
              once you accepted,{" "}
              <button
                onClick={reset}
                style={{ textDecoration: "underline", display: "inline" }}
              >
                click here to reset
              </button>{" "}
              and try connecting again. Refresh the page if the problem
              persists.
            </p>
          )}

          <button
            onClick={() => setQrShowing((s) => !s)}
            style={{ textAlign: "left" }}
          >
            <ModalSubheader
              className={classNames?.modalSubheader}
              style={{
                marginBottom: qrShowing ? "1rem" : 0,
                textDecoration: "underline",
              }}
            >
              {qrShowing ? "Hide" : "Show"} QR Code
            </ModalSubheader>
          </button>
        </>
      )}

      {!!uri && qrShowing && (
        <QRCode
          size={500}
          style={{ width: "100%", height: "100%" }}
          value={uri}
        />
      )}
    </BaseModal>
  )
}

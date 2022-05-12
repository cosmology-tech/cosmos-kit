import {
  isAndroid as checkIsAndroid,
  isMobile as checkIsMobile,
} from "@walletconnect/browser-utils"
import QRCode from "qrcode.react"
import React, { FunctionComponent, useEffect, useMemo } from "react"

import { BaseModal, BaseModalProps } from "./BaseModal"

export const WalletConnectQRCodeModal: FunctionComponent<
  BaseModalProps & {
    uri?: string
  }
> = ({ isOpen, uri, ...props }) => {
  const isMobile = useMemo(() => checkIsMobile(), [])
  const isAndroid = useMemo(() => checkIsAndroid(), [])

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
    if (isOpen && navigateToAppURL) {
      window.location.href = navigateToAppURL
    }
  }, [navigateToAppURL, isOpen])

  return (
    <BaseModal isOpen={isOpen} maxWidth="24rem" title="Scan QR code" {...props}>
      {!!uri && (
        <QRCode
          size={500}
          style={{ width: "100%", height: "100%" }}
          value={uri}
        />
      )}
    </BaseModal>
  )
}

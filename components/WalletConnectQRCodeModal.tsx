import {
  isAndroid as checkIsAndroid,
  isMobile as checkIsMobile,
} from "@walletconnect/browser-utils"
import { saveMobileLinkInfo } from "@walletconnect/utils"
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

  const navigateToAppURL = useMemo(() => {
    if (isMobile) {
      if (isAndroid) {
        // Save the mobile link.
        saveMobileLinkInfo({
          name: "Keplr",
          href: "intent://wcV1#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;",
        })

        return `intent://wcV1?${uri}#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;`
      } else {
        // Save the mobile link.
        saveMobileLinkInfo({
          name: "Keplr",
          href: "keplrwallet://wcV1",
        })

        return `keplrwallet://wcV1?${uri}`
      }
    }
    return undefined
  }, [isMobile, isAndroid, uri])

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

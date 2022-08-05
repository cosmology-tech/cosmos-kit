import { cleanup, render } from '@testing-library/react'
import React from 'react'
import { act } from 'react-dom/test-utils'

import { ChainInfoID, WalletType } from '@cosmos-wallet/core'

import {
  useWallet,
  useWalletManager,
  WalletManagerProvider,
} from '../components'

const DisplayStatus = () => {
  const { state } = useWalletManager()
  useWallet()

  return <p>{JSON.stringify(state.value)}</p>
}

describe('display status', () => {
  beforeAll(() =>
    act(() => {
      render(
        <WalletManagerProvider
          defaultChainId={ChainInfoID.Juno1}
          enabledWalletTypes={[WalletType.Keplr, WalletType.WalletConnectKeplr]}
        >
          <DisplayStatus />
        </WalletManagerProvider>
      )
    })
  )

  /* todo: update tests */
  it.skip('should display the status in the DOM', () => {
    // expect(
    //   screen.getByText(WalletConnectionStatus.ReadyForConnection)
    // ).toBeInTheDocument()
  })

  afterAll(cleanup)
})

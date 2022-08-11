import { cleanup, render, screen } from '@testing-library/react'
import React from 'react'
import { act } from 'react-dom/test-utils'

import {
  useWallet,
  useWalletManager,
  WalletManagerProvider,
} from '../components'
import {
  ChainInfoID,
  CosmosWalletStatus,
  KeplrWallet,
  KeplrWalletConnectWallet,
} from '@cosmos-wallet/core'

const DisplayStatus = () => {
  const { status } = useWalletManager()
  useWallet()

  return <p>{status}</p>
}

describe('display status', () => {
  beforeAll(() =>
    act(() => {
      render(
        <WalletManagerProvider
          defaultChainId={ChainInfoID.Juno1}
          enabledWallets={[KeplrWallet, KeplrWalletConnectWallet]}
        >
          <DisplayStatus />
        </WalletManagerProvider>
      )
    })
  )

  it('should display the status in the DOM', () => {
    expect(
      screen.getByText(CosmosWalletStatus.Disconnected)
    ).toBeInTheDocument()
  })

  afterAll(cleanup)
})

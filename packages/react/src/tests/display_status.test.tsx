import { CosmosKitStatus } from '@cosmos-kit/types'
import { cleanup, render, screen } from '@testing-library/react'
import { assets, chains } from 'chain-registry'
import React from 'react'
import { act } from 'react-dom/test-utils'

import {
  useWallet,
  useWalletManager,
  WalletManagerProvider,
} from '../components'

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
          defaultChainName={'cosmoshub'}
          chainInfo={{
            assets,
            chains,
          }}
        >
          <DisplayStatus />
        </WalletManagerProvider>
      )
    })
  )

  it('should display the status in the DOM', () => {
    expect(
      screen.getByText(CosmosKitStatus.Disconnected)
    ).toBeInTheDocument()
  })

  afterAll(cleanup)
})

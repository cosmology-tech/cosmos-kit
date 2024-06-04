import { act, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react"
import { useChains, useManager } from "../src"
import React from 'react'
import { customWrapper } from '../test-utils'
import '@testing-library/jest-dom'

const TestComponent = () => {
  const chains = useChains(['juno', 'stargaze', 'osmosis']);
  const manager = useManager()

  const leapWallet = manager.mainWallets.find(w => w.walletName === 'leap-extension')
  const stationWallet = manager.mainWallets.find(w => w.walletName === 'station-extension')

  return (
    <div>
      <ul>
        {Object.entries(chains).map(([name, chain]) => {
          return (
            <li key={name}>
              <span>{name}:{chain.address}</span>
            </li>
          )
        })}
      </ul>
      <button onClick={() => leapWallet?.connectAll()}>connect leap</button>
      <button onClick={() => leapWallet?.disconnectAll()}>disconnect leap</button>
      <button onClick={() => stationWallet?.connectAll()}>connect station</button>
    </div>
  )
}

describe('useChains', () => {

  const useContextMock = jest.spyOn(React, 'useContext')
  afterEach(() => {
    useContextMock.mockRestore()
  })

  it('should throw an error if no modal provided', async () => {
    useContextMock.mockReturnValue({ walletManager: {}, modalProvided: undefined } as any)
    renderHook(() => {
      try {
        useChains(['juno', 'stargaze'])
      } catch (error) {
        expect(error.message).toBe('You have to provide `walletModal` to use `useChains`, or use `useChainWallet` instead.')
      }
    }, { wrapper: customWrapper })
  })

  it('should throw an error if used without ChainProvider', async () => {
    renderHook(() => {
      try {
        useChains(['juno', 'stargaze'])
      } catch (error) {
        expect(error.message).toBe('You have forgotten to use ChainProvider.')
      }
    })
  })

  it('should render chains address', async () => {
    render(<TestComponent />, { wrapper: customWrapper })

    await act(async () => {
      await fireEvent.click(screen.getByText('connect leap'))
    })

    await waitFor(() => {
      expect(screen.getByText('juno:juno-1AddressLeap')).toBeInTheDocument()
      expect(screen.getByText('stargaze:stargaze-1AddressLeap')).toBeInTheDocument()
      expect(screen.getByText('osmosis:osmosis-1AddressLeap')).toBeInTheDocument()
    })

    await act(() => fireEvent.click(screen.getByText('disconnect leap')))

    await act(async () => {
      await fireEvent.click(screen.getByText('connect station'))
    })

    await waitFor(() => {
      expect(screen.getByText('juno:juno-1AddressStation')).toBeInTheDocument()
      expect(screen.getByText('stargaze:stargaze-1AddressStation')).toBeInTheDocument()
      expect(screen.getByText('osmosis:osmosis-1AddressStation')).toBeInTheDocument()
    })
  })


})

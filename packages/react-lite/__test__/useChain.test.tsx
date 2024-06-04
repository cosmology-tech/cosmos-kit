import { act, renderHook, waitFor, render, fireEvent, screen } from '@testing-library/react';
import { useChain, useManager } from '../src'
import { customWrapper } from "../test-utils"
import '@testing-library/jest-dom'
import React from 'react'

const TestComponent = () => {
  const chain = useChain('juno')
  const manager = useManager()
  return <div>
    <p>address:{chain.address}</p>
    <div className="flex flex-col space-y-2 w-80">
      {manager.getWalletRepo('juno').wallets.map(w => {
        return <button key={w.walletName} onClick={() => w.connect(true)}>{w.walletName}</button>
      })}
    </div>
  </div>
}

describe('useChain', () => {

  const useContextMock = jest.spyOn(React, 'useContext')

  afterEach(() => {
    useContextMock.mockRestore()
  })

  it('should throw an error if no modal provided', async () => {
    useContextMock.mockReturnValue({ walletManager: {}, modalProvided: undefined } as any)
    renderHook(() => {
      try {
        useChain('juno')
      } catch (error) {
        expect(error.message).toBe('You have to provide `walletModal` to use `useChain`, or use `useChainWallet` instead.')
      }
    }, { wrapper: customWrapper })
  })

  it('should throw an error if used without ChainProvider', async () => {
    renderHook(() => {
      try {
        useChain('juno')
      } catch (error) {
        expect(error.message).toBe('You have forgot to use ChainProvider.')
      }
    })
  })

  it('return undefined if not select a wallet', async () => {
    const { result } = renderHook(() => useChain('juno', false), { wrapper: customWrapper })
    await waitFor(() => {
      expect(result.current.address).toBeUndefined()
    })
  })

  it('should return address of selected wallet and chain', async () => {
    render(<TestComponent />, { wrapper: customWrapper })

    await act(() => fireEvent.click(screen.getByText('station-extension')))

    await waitFor(async () => {
      expect(await screen.getByText('address:juno-1AddressStation')).toBeInTheDocument()
    })

    await act(() => fireEvent.click(screen.getByText('leap-extension')))

    await waitFor(async () => {
      expect(await screen.getByText('address:juno-1AddressLeap')).toBeInTheDocument()
    })

  })
})

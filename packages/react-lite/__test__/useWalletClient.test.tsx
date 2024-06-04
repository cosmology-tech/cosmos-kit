import { act, renderHook, waitFor, render, screen, fireEvent } from "@testing-library/react"
import { useManager, useWalletClient } from "../src"
import { customWrapper } from "../test-utils"
import React from 'react'
import '@testing-library/jest-dom'

const TestComponent = () => {
  const { client, status, message } = useWalletClient()
  const manager = useManager()
  return <div>
    <p>client:{JSON.stringify(client)}</p>
    <p>status:{status}</p>
    <p>message:{message}</p>
    <div>
      {manager.getWalletRepo('juno').wallets.map(w => {
        return <button key={w.walletName} onClick={() => w.connect(true)}>{w.walletName}</button>
      })}
    </div>
  </div>
}

describe('useWalletClient', () => {

  it('should throw an error if used without ChainProvider', async () => {
    renderHook(() => {
      try {
        useWalletClient('leap-extension')
      } catch (error) {
        expect(error.message).toBe('You have forgot to use ChainProvider.')
      }
    })
  })

  it('should return wallet 1', async () => {
    render(<TestComponent />, { wrapper: customWrapper })

    await act(async () => {
      fireEvent.click(screen.getByText('leap-extension'))
    })

    await waitFor(async () => {
      expect(await screen.findByText('status:Done')).toBeInTheDocument()
    })
  })
})

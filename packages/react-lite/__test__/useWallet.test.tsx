import { renderHook, waitFor } from "@testing-library/react"
import { useManager, useWallet } from "../src"
import { customWrapper } from "../test-utils"

describe("useWallet", () => {
  it('should throw an error if used without ChainProvider', async () => {
    renderHook(() => {
      try {
        useManager()
      } catch (error) {
        expect(error.message).toBe('You have forgot to use ChainProvider.')
      }
    })
  })

  it('should return wallet 1', async () => {
    const { result: useWalletR } = renderHook(() => useWallet('leap-extension'), { wrapper: customWrapper })
    await waitFor(() => {
      expect(useWalletR.current.mainWallet?.walletName).toBe('leap-extension')
      expect(useWalletR.current.status).toBe('Connected')
    })
  })

  it('should return wallet 2', async () => {
    const { result: useWalletR } = renderHook(() => useWallet('station-extension'), { wrapper: customWrapper })
    await waitFor(() => {
      expect(useWalletR.current.mainWallet?.walletName).toBe('station-extension')
      expect(useWalletR.current.status).toBe('Connected')
    })
  })

})

import { act, renderHook, waitFor } from "@testing-library/react"
import { useChainWallet } from "../src"
import { customWrapper } from "../test-utils"

describe('useChainWallet', () => {
  it('should throw error, if not wrapped in ChainProvider', async () => {
    renderHook(() => {
      try {
        useChainWallet('juno', 'keplr-extension', true)
      } catch (error) {
        expect(error.message).toBe('You have forgot to use ChainProvider.')
      }
    })
  })
  it('should return right chain and wallet information', async () => {
    const { result } = renderHook(() => useChainWallet('juno', 'leap-extension', true), { wrapper: customWrapper })

    await act(async () => {
      await result.current?.connect()
    })

    await waitFor(() => {
      expect(result.current?.chain?.chain_name).toBe('juno')
    })
  })
})

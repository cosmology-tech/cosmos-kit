import { renderHook, waitFor } from '@testing-library/react'
import { useManager } from '../src'
import { Keplr } from '@keplr-wallet/types'
import { customWrapper } from '../test-utils';

describe('useManager', () => {
  it('should throw an error if used without ChainProvider', async () => {
    renderHook(() => {
      try {
        useManager()
      } catch (error) {
        expect(error.message).toBe('You have forgot to use ChainProvider.')
      }
    })
  })

  it('should create main wallet according wallets', async () => {
    const { result } = renderHook(() => useManager(), { wrapper: customWrapper })
    await waitFor(() => {
      expect(result.current.mainWallets).toHaveLength(3)
    })
  })
  it('should create wallet repo according chains', async () => {
    const { result } = renderHook(() => useManager(), { wrapper: customWrapper })
    await waitFor(() => {
      expect(result.current.walletRepos).toHaveLength(4)
    })
  })
})

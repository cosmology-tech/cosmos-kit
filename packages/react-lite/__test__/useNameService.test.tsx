import { renderHook, waitFor } from "@testing-library/react"
import { customWrapper } from "../test-utils"
import { useNameService } from "../src"
import { Keplr } from '@keplr-wallet/types'
import * as useManagerHook from '../src/hooks/useManager'

describe('useNameService', () => {

  const getNameServiceMock = jest.fn()
  const getNameServiceRegistryFromNameMock = jest.fn()


  beforeEach(() => {
    jest.spyOn(useManagerHook, 'useManager').mockImplementation(() => ({
      defaultNameService: 'icns',
      getNameService: getNameServiceMock,
      chainRecords: [],
      walletRepos: [],
      mainWallets: [],
      getChainRecord: jest.fn(),
      getWalletRepo: jest.fn(),
      addChains: jest.fn(),
      addEndpoints: jest.fn(),
      getChainLogo: jest.fn(),
      on: jest.fn(),
      off: jest.fn() // Add the missing properties here
    }))


  })

  it('should throw error, if there is no default name space', () => {
    renderHook(() => {
      try {
        useNameService('notexistnameservice')
      } catch (error) {
        expect(error.message).toBe('No such name service: notexistnameservice')
      }
    })
  })


  it('should return right name service', async () => {
    getNameServiceMock.mockImplementation(() => Promise.resolve('nameservice1'))

    const { result } = renderHook(() => useNameService(), { wrapper: customWrapper })
    await waitFor(() => {
      expect(result.current.data).toBe('nameservice1')
    })
  })

  it('should return error message', async () => {
    getNameServiceMock.mockImplementation(() => Promise.reject(new Error('error message')))

    const { result } = renderHook(() => useNameService(), { wrapper: customWrapper })
    await waitFor(() => {
      expect(result.current.message).toBe('error message')
    })
  })

})

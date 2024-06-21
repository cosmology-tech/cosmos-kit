import { createContext, useContext, useEffect, useState } from "react";


type SelectedWalletRepoContextType = {
  selectedWalletRepoName: string, selectWalletRepoName: (name: string) => void
}

export const SelectedWalletRepoContext = createContext<SelectedWalletRepoContextType>(null)

export const SelectedWalletRepoProvider = ({ children }) => {

  const [selectedWalletRepoName, selectWalletRepoName] = useState<string>('')

  useEffect(() => {
    const selectedWalletName = localStorage.getItem('cosmos-kit@2:core//current-wallet')
    if (selectedWalletName) {
      selectWalletRepoName(selectedWalletName)
    }
  }, [])


  return <SelectedWalletRepoContext.Provider value={{
    selectedWalletRepoName, selectWalletRepoName
  }}>
    {children}
  </SelectedWalletRepoContext.Provider>
}

export const useSelectedWalletRepoContext = () => useContext(SelectedWalletRepoContext)

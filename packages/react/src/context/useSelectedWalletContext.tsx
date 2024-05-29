import { createContext, useContext, useState } from "react";


export const SelectedWalletRepoContext = createContext(null)


export const SelectedWalletRepoProvider = ({ children }) => {

  const [selectedWalletRepo, selectWalletRepo] = useState(null)

  return <SelectedWalletRepoContext.Provider value={{
    selectedWalletRepo, selectWalletRepo
  }}>
    {children}
  </SelectedWalletRepoContext.Provider>
}

export const useSelectedWalletRepoContext = () => useContext(SelectedWalletRepoContext)

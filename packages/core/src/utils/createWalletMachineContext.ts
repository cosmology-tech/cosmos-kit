import type { WalletMachineContextType } from '../machine'
import { walletMachine } from '../machine'

/* create wallet machine context with its default values */
export function createWalletMachineContext(
  context: Partial<WalletMachineContextType>
): WalletMachineContextType {
  return {
    ...walletMachine.context,
    ...context,
  }
}

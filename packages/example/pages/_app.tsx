import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useWallet, WalletProvider } from '@cosmos-kit/react'
import { Button, ChakraProvider, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { defaultTheme } from '../config';
import { WalletManager, WalletModalProps, ChainRegistry } from '@cosmos-kit/core';
import { allWallets } from '@cosmos-kit/registry';
import { chains as rawChains } from 'chain-registry';
import QRCode from 'qrcode.react';
import { convert } from '../utils';


const chains: ChainRegistry[] = rawChains
  .filter((chain) => chain.network_type !== 'testnet')
  .map((chain) => convert(chain));

// const MyWalletModal = ({ isOpen, setOpen, chainName, qrUri }: WalletModalProps) => {
//   // const { Canvas } = useQRCode();
//   const { walletManager, disconnect, walletStatus, username, address } = useWallet(chainName);
//   const onClose = () => setOpen(false);
//   console.log(222, qrUri)
//   return (
//     <Modal isOpen={isOpen} onClose={onClose}>
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader>Choose Wallet</ModalHeader>
//         <ModalCloseButton />
//         <ModalBody>
//           {walletManager.activeWallets.map(({ name, prettyName }) => {
//             const onClick = async () => {
//               walletManager.setCurrentWallet(name);
//               await walletManager.connect();      
//             }
//             return <Button key={name} colorScheme='blue' variant='ghost' onClick={onClick}>{prettyName}</Button>
//           })}
//         </ModalBody>
//         <ModalFooter>
//           {(qrUri) && (
//             <div style={{
//               padding: 50,
//               borderRadius: 10,
//               backgroundColor: "#ffffff",
//             }}>
//               <QRCode size={300} value={qrUri} />
//             </div>
//           )}
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   )
// }


function MyApp({ Component, pageProps }: AppProps) {
  const walletManager = new WalletManager(
    chains,
    allWallets
  )
  // walletManager.useWallets('keplr-extension');
  // walletManager.useChains();

  walletManager.setAutos({
    connectWhenInit: false,
    connectWhenCurrentChanges: false,
    closeModalWhenWalletIsConnected: false,
    closeModalWhenWalletIsDisconnected: false,
    closeModalWhenWalletIsRejected: false,
  })

  return (
    <ChakraProvider theme={defaultTheme}>
      <WalletProvider
        // chainSelector={MyChainSelector}
        // walletModal={MyWalletModal}
        walletManager={walletManager}
      >
        <Component {...pageProps} />
      </WalletProvider>
    </ChakraProvider>
  )
}

export default MyApp

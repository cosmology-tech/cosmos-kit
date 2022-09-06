import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { WalletProvider } from '@cosmos-kit/react'
import { Button, ChakraProvider, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { defaultTheme } from '@/config';
import { ChainSelectorProps, WalletModalProps } from '@cosmos-kit/core/types';
import { createWalletManager } from '@cosmos-kit/core';
import { useState } from 'react';
import { ChainOption, ChooseChain, handleSelectChainDropdown } from '@/components';
import { useQRCode } from 'next-qrcode';
import QRCode from 'qrcode.react';

// const MyChainSelector = ({ name, setName, chainOptions }: ChainSelectorProps) => {
//   const onChainChange: handleSelectChainDropdown = (
//     selectedValue: ChainOption | null
//   ) => {
//     if (selectedValue) {
//       setName(selectedValue.chainName);
//     }
//   };

//   return (
//     <ChooseChain
//       chainName={name}
//       chainInfos={chainOptions}
//       onChange={onChainChange}
//     />
//   )
// }

const MyWalletModal = ({ open, setOpen, walletOptions, qrUri }: WalletModalProps) => {
  // const { Canvas } = useQRCode();
  const onClose = () => setOpen(false);
  console.log(222, qrUri)
  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Choose Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {walletOptions.map(({ id, title, onClick }) => (
            <Button key={id} colorScheme='blue' variant='ghost' onClick={onClick}>{title}</Button>
          ))}
        </ModalBody>
        <ModalFooter>
          {(qrUri) && (
            <div style={{
              padding: 50,
              borderRadius: 10,
              backgroundColor: "#ffffff",
            }}>
              <QRCode size={300} value={qrUri} />
            </div>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}


function MyApp({ Component, pageProps }: AppProps) {
  const walletManager = createWalletManager();
  // walletManager.useWallets('keplr-extension');
  // walletManager.useChains();
  // walletManager.autoConnect = true;

  return (
    <ChakraProvider theme={defaultTheme}>
      <WalletProvider
        // chainSelector={MyChainSelector}
        walletModal={MyWalletModal}
        walletManager={walletManager}
      >
        <Component {...pageProps} />
      </WalletProvider>
    </ChakraProvider>
  )
}

export default MyApp

import {
  Box,
  CloseButton,
  Container,
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
// import { useQRCode } from 'next-qrcode'
import React, { useEffect } from 'react'

import { WalletModalProps } from '../core/types'

// const useQRCode = () => {
//   return {
//     Canvas: {},
//   }
// } // TODO

// const QRCode = () => {
//   const { Canvas } = useQRCode()
//   const color = useColorModeValue('#000000eb', '#ffffff')
//   const width = useBreakpointValue({ base: 300, md: 400, lg: 500 })

//   return (
//     <Canvas
//       text={'https://app.osmosis.zone/?from=ATOM&to=OSMO'}
//       options={{
//         type: 'image/jpeg',
//         quality: 0.3,
//         margin: 0,
//         level: 'M',
//         scale: 4,
//         width: width,
//         color: {
//           dark: color,
//           light: '#00000000',
//         },
//       }}
//     />
//   )
// }

export function WalletModal({
  open,
  setOpen,
  walletOptions,
}: WalletModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: defaultModalIsOpen,
    onOpen: defaultModalOnOpen,
    onClose: defaultModalOnClose,
  } = useDisclosure()

  useEffect(() => {
    if (open === undefined) setTimeout(defaultModalOnOpen, 500)
  }, [])

  useEffect(() => {
    if (open) defaultModalOnOpen()
  }, [open])

  useEffect(() => {
    if (open === undefined && !defaultModalIsOpen)
      setTimeout(defaultModalOnOpen, 1000)
  }, [defaultModalIsOpen])

  return (
    <Container p={4}>
      <Modal
        isOpen={defaultModalIsOpen}
        onClose={() => {
          defaultModalOnClose()
          if (setOpen) setOpen(false)
        }}
        autoFocus={false}
      >
        <ModalOverlay />
        <ModalContent borderRadius="2xl" maxW={{ base: 'xs', md: '2xl' }} p={6}>
          <Flex justify="space-between" mb={6}>
            <Heading as="h3" fontSize="2xl">
              Select a wallet
            </Heading>
            <CloseButton
              onClick={() => {
                defaultModalOnClose()
                if (setOpen) setOpen(false)
              }}
            />
          </Flex>
          <Stack spacing={6}>
            {walletOptions.map(({ id, title, logo, describe, onClick }) => {
              return (
                <Flex
                  as="button"
                  id={id}
                  key={id}
                  align={{ md: 'center' }}
                  borderRadius="2xl"
                  border="1px solid"
                  borderColor={useColorModeValue(
                    'blackAlpha.500',
                    'whiteAlpha.500'
                  )}
                  bg={useColorModeValue('blackAlpha.50', 'whiteAlpha.50')}
                  flexDirection={{ base: 'column', md: 'row' }}
                  p={6}
                  onClick={onClick}
                >
                  <Flex
                    align="center"
                    borderRadius="xl"
                    overflow="hidden"
                    w={16}
                    h={16}
                    mr={{ md: 4 }}
                    mb={{ base: 2, md: 0 }}
                  >
                    <Image src={logo} />
                  </Flex>
                  <Box textAlign="start">
                    <Text fontSize="2xl" fontWeight="bold">
                      {title}
                    </Text>
                    <Text
                      fontWeight="bold"
                      color={useColorModeValue(
                        'blackAlpha.600',
                        'whiteAlpha.600'
                      )}
                    >
                      {describe}
                    </Text>
                  </Box>
                </Flex>
              )
            })}
          </Stack>
          {/* mobile wallet QRcode */}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent maxW="fit-content">
              <ModalHeader>Scan QR Code</ModalHeader>
              <ModalCloseButton
                _focus={{ outline: 'none' }}
                top={4}
                right={6}
              />
              <ModalBody px={6} pt={2} pb={8}>
                <Flex justify="center">
                  <div />
                </Flex>
              </ModalBody>
            </ModalContent>
          </Modal>
        </ModalContent>
      </Modal>
    </Container>
  )
}

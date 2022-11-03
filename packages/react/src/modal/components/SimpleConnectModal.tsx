import { Modal, ModalContent, ModalOverlay, Stack } from '@chakra-ui/react';
import React from 'react';

import { ConnectModalType } from './types';

export const SimpleConnectModal = ({
  initialRef,
  modalHead,
  modalContent,
  modalIsOpen,
  modalOnClose,
}: ConnectModalType) => {
  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={modalIsOpen}
      isCentered={true}
      onClose={modalOnClose}
    >
      <ModalOverlay />
      <ModalContent
        alignSelf="center"
        borderRadius="xl"
        w="full"
        maxW={96}
        minH={80}
        p={1}
        pb={8}
        mx={4}
        _focus={{ outline: 'none' }}
      >
        <Stack flex={1} spacing={0} h="full">
          {modalHead}
          {modalContent}
        </Stack>
      </ModalContent>
    </Modal>
  );
};

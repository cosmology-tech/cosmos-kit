import { Modal, ModalContent, ModalOverlay, Stack } from '@chakra-ui/react';
import React from 'react';

import { AnimateBox, ModalContentVariants } from './motion-component';
import { ConnectModalType } from './types';

export const SimpleConnectModalV1 = ({
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
        maxW="fit-content"
        p={1}
        pb={8}
        mx={4}
        _focus={{ outline: 'none' }}
      >
        <AnimateBox
          initial="hidden"
          animate="enter"
          variants={ModalContentVariants}
        >
          <Stack flex={1} spacing={0} h="full">
            {modalHead}
            {modalContent}
          </Stack>
        </AnimateBox>
      </ModalContent>
    </Modal>
  );
};

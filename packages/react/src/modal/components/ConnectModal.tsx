import {
  Box,
  Button,
  Center,
  Icon,
  Image,
  Modal,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
  useDimensions,
} from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';
import React, { useRef } from 'react';
import { BsPatchExclamation, BsPatchQuestion } from 'react-icons/bs';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

import {
  ConnectModalContentType,
  ConnectWalletCardType,
  DisplayWalletListType,
  DownloadWalletButtonType,
  WalletModalType,
} from '../types';
import {
  AnimateBox,
  LoadingVariants,
  ModalContentVariants,
} from './motion-component';

export const ConnectedContent = ({
  userInfo,
  addressBtn,
  connectWalletButton,
}: ConnectWalletCardType) => {
  return (
    <Stack spacing={4} p={6}>
      {userInfo}
      {addressBtn}
      {connectWalletButton}
    </Stack>
  );
};

export const InstallWalletButton = ({
  icon,
  text,
}: DownloadWalletButtonType) => {
  return (
    <Box w="full" px={6}>
      <Button
        variant="unstyled"
        w="full"
        h="auto"
        fontWeight="medium"
        fontSize="lg"
        color={useColorModeValue(
          'rgba(37, 57, 201, 0.72)',
          'rgba(196, 203, 255, 0.9)'
        )}
        border="1px solid"
        borderColor={useColorModeValue('#ffffff', 'rgba(0, 0, 0, 0.25)')}
        bg={useColorModeValue(
          'rgba(37, 57, 201, 0.1)',
          'rgba(40, 62, 219, 0.15)'
        )}
        boxShadow={useColorModeValue(
          '0 0 1px 2px rgba(37, 57, 201, 0.5)',
          '0 0 1px 2px rgba(196, 203, 255, 0.5)'
        )}
        _hover={{ opacity: 0.8 }}
        _active={{ opacity: 0.9 }}
        _focus={{ outline: 'none' }}
      >
        <Stack
          w="full"
          isInline={true}
          justifyContent="center"
          alignItems="center"
          p={3}
        >
          {icon && <Icon as={icon} />}
          <Text whiteSpace="break-spaces">
            {text ? text : `Install Wallet`}
          </Text>
        </Stack>
      </Button>
    </Box>
  );
};

export const ExtensionContent = ({
  selectedWallet,
  stateHeader,
  stateDesc,
  downloadWalletButton,
  connectWalletButton,
  isLoading,
  isReconnect,
  isWarning,
}: ConnectModalContentType) => {
  return (
    <AnimateBox
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={ModalContentVariants}
    >
      <Stack justifyContent="center" alignItems="center" py={8} spacing={6}>
        <Box
          position="relative"
          w={24}
          h={24}
          minW={24}
          minH={24}
          maxW={24}
          maxH={24}
        >
          {isLoading && (
            <AnimateBox
              position="absolute"
              top={-2}
              right={-2}
              bottom={-2}
              left={-2}
              border="2px solid"
              borderTopColor="transparent"
              borderBottomColor="transparent"
              borderLeftColor="purple.300"
              borderRightColor="purple.300"
              borderRadius="full"
              initial="hidden"
              animate="animate"
              variants={LoadingVariants}
            ></AnimateBox>
          )}
          {isReconnect && (
            <Box
              position="absolute"
              top={-2}
              right={-2}
              bottom={-2}
              left={-2}
              border="2px solid"
              borderColor={
                isWarning
                  ? useColorModeValue('orange.300', 'red.500')
                  : useColorModeValue('red.400', 'red.500')
              }
              borderRadius="full"
            >
              <Center
                position="absolute"
                right={-2}
                bottom={-1}
                borderRadius="full"
                bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.700')}
                boxShadow="base"
                p={1.5}
              >
                <Icon
                  as={isWarning ? BsPatchQuestion : BsPatchExclamation}
                  w={6}
                  h={6}
                  color={
                    isWarning
                      ? useColorModeValue('orange.300', 'red.500')
                      : useColorModeValue('red.500', 'red.500')
                  }
                />
              </Center>
            </Box>
          )}
          <Image src={selectedWallet.logo} />
        </Box>
        <Stack justifyContent="center" alignItems="center" spacing={1.5} px={6}>
          <Text fontSize="lg" fontWeight="semibold">
            {stateHeader}
          </Text>
          <Text
            textAlign="center"
            lineHeight={1.3}
            opacity={0.7}
            whiteSpace="pre-line"
          >
            {stateDesc}
          </Text>
        </Stack>
        {downloadWalletButton && downloadWalletButton}
        {connectWalletButton && (
          <Box w="full" px={8}>
            {connectWalletButton}
          </Box>
        )}
      </Stack>
    </AnimateBox>
  );
};

export const QRCode = ({ link }: { link: string }) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const dimensions = useDimensions(elementRef);

  return (
    <AnimateBox
      ref={elementRef}
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={ModalContentVariants}
    >
      <Center py={2} px={6}>
        <Box
          w="full"
          border="1px solid"
          borderColor={useColorModeValue('blackAlpha.100', 'whiteAlpha.600')}
          borderRadius="lg"
          boxShadow="base"
          p={5}
        >
          <QRCodeSVG
            value={link}
            size={dimensions ? dimensions.contentBox.width - 24 : undefined}
            bgColor={'#ffffff'}
            fgColor={'#000000'}
            level={'L'}
            includeMargin={false}
          />
        </Box>
      </Center>
    </AnimateBox>
  );
};

export const DisplayWalletList = ({
  walletsData,
  onClick,
}: DisplayWalletListType) => {
  return (
    <AnimateBox
      initial="hidden"
      animate="enter"
      variants={ModalContentVariants}
    >
      <Stack spacing={3}>
        {walletsData.map(({ id, walletName, logo }, i) => {
          return (
            <Button
              id={id}
              key={id}
              variant="unstyled"
              display="flex"
              h="fit-content"
              p={2.5}
              justifyContent="start"
              borderRadius="none"
              color={useColorModeValue('blackAlpha.800', 'whiteAlpha.800')}
              boxShadow={useColorModeValue(
                '0 20px 1px -19px #fff',
                '0 20px 1px -19px #2d3748'
              )}
              transition="all .4s ease-in-out"
              _hover={{
                color: useColorModeValue('primary.300', 'primary.100'),
                borderRadius: 'md',
                boxShadow: useColorModeValue(
                  '0 0 2px 0 rgba(98, 17, 240, 0.5)',
                  '0 0 2px 0 rgba(182, 153, 232, 0.9)'
                ),
              }}
              _focus={{ outline: 'none' }}
              onClick={(e) => {
                if (e.currentTarget.id === id) onClick(walletsData[i]);
              }}
            >
              <Stack
                w="full"
                isInline={true}
                justifyContent="start"
                alignItems="center"
                spacing={2.5}
              >
                <Box borderRadius="lg" overflow="hidden" w={9} h={9}>
                  <Image src={logo} />
                </Box>
                <Box textAlign="start" flex={1}>
                  <Text fontSize="xl" fontWeight="semibold" lineHeight={1.1}>
                    {walletName}
                  </Text>
                </Box>
                <Box>
                  <Icon as={FiChevronRight} />
                </Box>
              </Stack>
            </Button>
          );
        })}
      </Stack>
    </AnimateBox>
  );
};

export const ModalHead = ({
  title,
  backButton,
  onClose,
  onBack,
}: {
  title: string;
  backButton: boolean;
  onClose: () => void;
  onBack?: () => void;
}) => {
  return (
    <Stack
      w="full"
      isInline={true}
      alignItems="center"
      h="fit-content"
      mb={2.5}
    >
      {backButton && (
        <Button variant="ghost" borderRadius="full" px={0} onClick={onBack}>
          <Icon as={FiChevronLeft} w={6} h={6} />
        </Button>
      )}
      <Box flex={1} pl={2}>
        <Text
          fontSize="lg"
          fontWeight="medium"
          textAlign={backButton ? 'center' : 'start'}
        >
          {title}
        </Text>
      </Box>
      <Button variant="ghost" borderRadius="full" px={0} onClick={onClose}>
        <Icon as={FiX} w={5} h={5} />
      </Button>
    </Stack>
  );
};

export const ConnectModal = ({
  modalHead,
  modalContent,
  modalIsOpen,
  modalOnClose,
}: WalletModalType) => {
  return (
    <Modal isOpen={modalIsOpen} onClose={modalOnClose} autoFocus={false}>
      <ModalOverlay />
      <ModalContent
        borderRadius="xl"
        w="full"
        alignSelf="center"
        maxW={96}
        minH={72}
        p={5}
        mx={4}
      >
        <Stack spacing={1}>
          {modalHead}
          {modalContent}
        </Stack>
      </ModalContent>
    </Modal>
  );
};

import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Image,
  Stack,
  Text,
  useColorMode,
  useDimensions,
} from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';
import React, { useRef } from 'react';
import { FiChevronRight } from 'react-icons/fi';

import { handleChangeColorModeValue } from './default-component';
import {
  AnimateBox,
  LoadingVariants,
  ModalContentVariants,
} from './motion-component';
import {
  ConnectModalContentType,
  DisplayWalletListType,
  DownloadWalletButtonType,
} from './types';

export const SimpleInstallWalletButton = ({
  icon,
  text,
  onClick,
  disabled,
}: DownloadWalletButtonType) => {
  const { colorMode } = useColorMode();
  return (
    <Box w="full" px={6} mt={1}>
      <Button
        onClick={onClick}
        variant="unstyled"
        w="full"
        h="auto"
        fontWeight="medium"
        fontSize="lg"
        color={handleChangeColorModeValue(
          colorMode,
          'rgba(37, 57, 201, 0.72)',
          'rgba(196, 203, 255, 0.9)'
        )}
        border="1px solid"
        borderColor={handleChangeColorModeValue(
          colorMode,
          '#ffffff',
          'rgba(0, 0, 0, 0.25)'
        )}
        bg={handleChangeColorModeValue(
          colorMode,
          'rgba(37, 57, 201, 0.1)',
          'rgba(40, 62, 219, 0.15)'
        )}
        boxShadow={handleChangeColorModeValue(
          colorMode,
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

export const SimpleDisplayModalContent = ({
  status,
  logo,
  contentHeader,
  contentDesc,
  username,
  walletIcon,
  addressButton,
  bottomButton,
  bottomLink,
}: ConnectModalContentType) => {
  const { colorMode } = useColorMode();
  const Style = {
    warning: {
      color: handleChangeColorModeValue(colorMode, 'orange.300', 'orange.400'),
    },
    error: {
      color: handleChangeColorModeValue(colorMode, 'red.400', 'red.500'),
    },
  };

  return (
    <AnimateBox
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={ModalContentVariants}
    >
      <Flex
        flex={1}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        p={4}
        pt={10}
      >
        {logo && (
          <Center
            position="relative"
            mx="auto"
            w={24}
            h={24}
            minW={24}
            minH={24}
            maxW={24}
            maxH={24}
            mb={typeof logo === 'string' ? 6 : 0}
          >
            {status === 'loading' && (
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
            {(status === 'warning' || status === 'error') && (
              <Box
                position="absolute"
                top={-2}
                right={-2}
                bottom={-2}
                left={-2}
                border="2px solid"
                borderColor={Style[status].color}
                borderRadius="full"
              ></Box>
            )}
            <Box borderRadius="full" overflow="hidden">
              {typeof logo === 'string' ? (
                <Image src={logo} />
              ) : (
                <Icon as={logo} w="full" h="full" />
              )}
            </Box>
          </Center>
        )}
        {contentHeader && (
          <Text
            fontSize="lg"
            fontWeight="semibold"
            color={Style[status as keyof typeof Style]?.color}
            mb={0.5}
          >
            {contentHeader}
          </Text>
        )}
        {contentDesc && (
          <Text lineHeight={1.3} opacity={0.7} whiteSpace="pre-line">
            {contentDesc}
          </Text>
        )}
        {username && (
          <Stack isInline={true} justifyContent="center" alignItems="center">
            <Center w={5} h={5} minW={5} minH={5} maxW={5} maxH={5}>
              <Image src={walletIcon} />
            </Center>
            <Text fontSize="xl" fontWeight="semibold">
              {username}
            </Text>
          </Stack>
        )}
        {addressButton && (
          <Box w="full" pt={4} px={8}>
            {addressButton}
          </Box>
        )}
        {bottomButton && (
          <Box w="full" pt={addressButton ? 4 : 4}>
            {bottomButton}
          </Box>
        )}
        {bottomLink && (
          <Box w="full" pt={addressButton ? 4 : 4}>
            {bottomLink}
          </Box>
        )}
      </Flex>
    </AnimateBox>
  );
};

export const SimpleQRCode = ({
  link,
  description,
}: {
  link: string;
  description?: string;
}) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const dimensions = useDimensions(elementRef);
  const { colorMode } = useColorMode();
  return (
    <AnimateBox
      ref={elementRef}
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={ModalContentVariants}
    >
      <Stack
        justifyContent="center"
        alignItems="center"
        spacing={4}
        p={8}
        pt={6}
      >
        {description && (
          <Text fontWeight="medium" textAlign="center" opacity={0.75}>
            {description}
          </Text>
        )}
        <Box
          w="full"
          border="1px solid"
          borderColor={handleChangeColorModeValue(
            colorMode,
            'blackAlpha.100',
            'whiteAlpha.600'
          )}
          borderRadius="lg"
          boxShadow="base"
          p={5}
        >
          <QRCodeSVG
            value={link}
            size={(dimensions && dimensions.contentBox.width - 24) || void 0}
            bgColor={'#ffffff'}
            fgColor={'#000000'}
            level={'L'}
            includeMargin={false}
          />
        </Box>
      </Stack>
    </AnimateBox>
  );
};

export const SimpleDisplayWalletList = ({
  initialFocus,
  walletsData,
  handleClick,
}: DisplayWalletListType) => {
  const { colorMode } = useColorMode();

  return (
    <AnimateBox
      initial="hidden"
      animate="enter"
      variants={ModalContentVariants}
    >
      <Stack
        flex={1}
        spacing={3}
        maxH={96}
        overflowY="scroll"
        pl={4}
        pr={1}
        py={0.5}
        css={{
          // For Firefox
          scrollbarWidth: 'auto',
          scrollbarColor: handleChangeColorModeValue(
            colorMode,
            'rgba(0,0,0,0.3) rgba(0,0,0,0.2)',
            'rgba(255,255,255,0.2) rgba(255,255,255,0.1)'
          ),
          // For Chrome and other browsers except Firefox
          '&::-webkit-scrollbar': {
            width: '10px',
            background: 'transparent',
            // background: "gray",
            borderRadius: '3px',
            mr: 1,
          },
          '&::-webkit-scrollbar-thumb': {
            background: handleChangeColorModeValue(
              colorMode,
              'rgba(0,0,0,0.1)',
              'rgba(255,255,255,0.1)'
            ),
            borderRadius: '6px',
            border: '3px solid transparent',
            backgroundClip: 'content-box',
          },
        }}
      >
        {walletsData.map(({ id, displayName, logo }, i) => {
          return (
            <Button
              ref={i === 0 ? initialFocus : null}
              id={id}
              key={id}
              variant="unstyled"
              display="flex"
              h="fit-content"
              p={2.5}
              justifyContent="start"
              borderRadius="none"
              whiteSpace="break-spaces"
              color={handleChangeColorModeValue(
                colorMode,
                'blackAlpha.800',
                'whiteAlpha.800'
              )}
              boxShadow={handleChangeColorModeValue(
                colorMode,
                '0 20px 1px -19px #fff',
                '0 20px 1px -19px #2d3748'
              )}
              transition="all .4s ease-in-out"
              _hover={{
                color: handleChangeColorModeValue(
                  colorMode,
                  'primary.300',
                  'primary.100'
                ),
                borderRadius: 'md',
                boxShadow: handleChangeColorModeValue(
                  colorMode,
                  '0 0 2px 0 rgba(98, 17, 240, 0.5)',
                  '0 0 2px 0 rgba(182, 153, 232, 0.9)'
                ),
              }}
              _focus={{
                borderRadius: 'md',
                outline: 'none',
              }}
              onClick={(e) => {
                if (e.currentTarget.id === id) handleClick(walletsData[i]);
              }}
            >
              <Stack
                w="full"
                isInline={true}
                justifyContent="start"
                alignItems="center"
                spacing={2.5}
              >
                <Box
                  borderRadius="lg"
                  overflow="hidden"
                  w={9}
                  h={9}
                  minW={9}
                  minH={9}
                  maxW={9}
                  maxH={9}
                >
                  <Image src={(typeof logo === 'string' && logo) || void 0} />
                </Box>
                <Box textAlign="start" flex={1}>
                  <Text fontSize="xl" fontWeight="semibold" lineHeight={1.1}>
                    {displayName}
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

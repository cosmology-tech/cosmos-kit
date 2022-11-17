import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Icon,
  Image,
  Stack,
  Text,
  useBreakpointValue,
  useColorMode,
  useDimensions,
} from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';
import React, { useRef } from 'react';

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
}: DownloadWalletButtonType) => {
  const { colorMode } = useColorMode();
  return (
    <Box w="full" px={6} mt={1}>
      <Button
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
}: ConnectModalContentType) => {
  const { colorMode } = useColorMode();
  const Style = {
    warning: {
      color: handleChangeColorModeValue(colorMode, 'orange.300', 'orange.400'),
    },
    error: {
      color: handleChangeColorModeValue(colorMode, 'red.400', 'red.500'),
    },
    loading: {
      color: handleChangeColorModeValue(colorMode, 'green.400', 'green.500'),
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
        w={{ base: '85vw', md: 96 }}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        p={4}
        pt={8}
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
            mb={typeof logo === 'string' ? 6 : 3}
          >
            {status === 'loading' && (
              <AnimateBox
                position="absolute"
                top={-2.5}
                right={-2.5}
                bottom={-2.5}
                left={-2.5}
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
            <Box borderRadius="full" p={typeof logo === 'string' ? 3.5 : 0}>
              {typeof logo === 'string' ? (
                <Image src={logo} w="full" h="full" />
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
            color={
              status && status !== 'loading' ? Style[status]?.color : void 0
            }
            mb={1}
          >
            {contentHeader}
          </Text>
        )}
        {contentDesc && (
          <Text
            lineHeight={1.3}
            opacity={0.7}
            whiteSpace="pre-line"
            maxW={72}
            px={2}
            mb={1}
          >
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
  const elementRef = useRef(null);
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
        w={{ base: '85vw', md: 96 }}
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
        <Center
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
            size={dimensions ? dimensions.contentBox.width - 24 : void 0}
            bgColor={'#ffffff'}
            fgColor={'#000000'}
            level={'L'}
            includeMargin={false}
          />
        </Center>
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
  const mobile = useBreakpointValue({ base: 'mobile', md: 'desktop' });

  return (
    <AnimateBox
      initial="hidden"
      animate="enter"
      variants={ModalContentVariants}
    >
      <Grid
        templateColumns="1fr 1fr"
        templateRows={{ base: 'max-content', md: 'auto' }}
        gap={2}
        maxH={96}
        minH={60}
        w={{ base: '88vw', md: 'md' }}
        overflowY="scroll"
        pl={4}
        pr={4}
        py={0.5}
        mt={0.5}
        css={{
          // for firefox
          scrollbarWidth: 'none',
          // for chrome
          '::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {walletsData.map(({ name, prettyName, logo }, i) => {
          if (i < 2 && mobile === 'desktop')
            return (
              <GridItem
                display={{ base: 'none', md: 'flex' }}
                pr={i === 0 ? 1 : void 0}
                pl={i === 1 ? 1 : void 0}
                pb={1.5}
              >
                <Button
                  ref={i === 0 ? initialFocus : null}
                  id={name}
                  key={name}
                  variant="unstyled"
                  w="full"
                  h="full"
                  p={3}
                  py={7}
                  justifyContent="start"
                  borderRadius="md"
                  whiteSpace="break-spaces"
                  color={handleChangeColorModeValue(
                    colorMode,
                    'blackAlpha.800',
                    'whiteAlpha.800'
                  )}
                  transition="all .4s ease-in-out"
                  bg={handleChangeColorModeValue(
                    colorMode,
                    'gray.100',
                    'blackAlpha.500'
                  )}
                  _hover={{
                    boxShadow: '0 0 0 1px #6A66FF',
                  }}
                  _focus={{
                    borderRadius: 'md',
                    boxShadow: '0 0 3px -1px #6A66FF',
                  }}
                  onClick={(e) => {
                    if (e.currentTarget.id === name)
                      handleClick(walletsData[i]);
                  }}
                >
                  <Stack
                    w="full"
                    h="full"
                    justifyContent="start"
                    alignItems="center"
                    spacing={2.5}
                  >
                    <Center
                      borderRadius="lg"
                      overflow="hidden"
                      w={{ base: 12, md: 20 }}
                      h={{ base: 12, md: 20 }}
                      minW={{ base: 12, md: 20 }}
                      minH={{ base: 12, md: 20 }}
                      maxW={{ base: 12, md: 20 }}
                      maxH={{ base: 12, md: 20 }}
                      p={1}
                    >
                      <Image src={typeof logo === 'string' ? logo : void 0} />
                    </Center>
                    <Flex
                      flex={1}
                      alignItems="center"
                      textAlign="center"
                      px={1}
                    >
                      <Text
                        fontSize="lg"
                        fontWeight="medium"
                        lineHeight={1.1}
                        whiteSpace="pre-wrap"
                      >
                        {prettyName}
                      </Text>
                    </Flex>
                  </Stack>
                </Button>
              </GridItem>
            );
          return (
            <GridItem
              display={{
                md: i > 1 ? 'block' : 'none',
              }}
              colSpan={2}
              w="full"
            >
              <Button
                ref={i === 0 ? initialFocus : null}
                id={name}
                key={name}
                variant="unstyled"
                display="flex"
                w="full"
                h="fit-content"
                p={2.5}
                justifyContent="start"
                borderRadius="md"
                whiteSpace="break-spaces"
                color={handleChangeColorModeValue(
                  colorMode,
                  'blackAlpha.800',
                  'whiteAlpha.800'
                )}
                transition="all .4s ease-in-out"
                bg={handleChangeColorModeValue(
                  colorMode,
                  'gray.100',
                  'blackAlpha.500'
                )}
                _hover={{
                  boxShadow: '0 0 0 1px #6A66FF',
                }}
                _focus={{
                  borderRadius: 'md',
                  outline: 'none',
                }}
                onClick={(e) => {
                  if (e.currentTarget.id === name) handleClick(walletsData[i]);
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
                    <Image src={typeof logo === 'string' ? logo : void 0} />
                  </Box>
                  <Box textAlign="start" flex={1}>
                    <Text fontSize="lg" fontWeight="medium" lineHeight={1.1}>
                      {prettyName}
                    </Text>
                  </Box>
                </Stack>
              </Button>
            </GridItem>
          );
        })}
      </Grid>
    </AnimateBox>
  );
};

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
  useColorMode,
  useDimensions,
} from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';
import React, { useEffect, useRef, useState } from 'react';

import { handleChangeColorModeValue } from './default-component';
import {
  AnimateBox,
  AnimateGridItem,
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
    <Box w="full" px={6}>
      <Button
        variant="unstyled"
        w="full"
        h="auto"
        fontWeight="medium"
        fontSize="md"
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
  };

  return (
    <AnimateBox
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={ModalContentVariants}
    >
      <Flex
        w={{ base: '88vw', md: 'xs' }}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        p={4}
        pt={5}
      >
        {logo && (
          <Center
            position="relative"
            mx="auto"
            w={20}
            h={20}
            minW={20}
            minH={20}
            maxW={20}
            maxH={20}
            mb={typeof logo === 'string' ? 4 : 2}
          >
            {status === 'loading' && (
              <AnimateBox
                position="absolute"
                top={-1.5}
                right={-1.5}
                bottom={-1.5}
                left={-1.5}
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
            fontSize="md"
            fontWeight="semibold"
            color={Style[status]?.color}
            mb={1}
          >
            {contentHeader}
          </Text>
        )}
        {contentDesc && (
          <Text
            fontSize="sm"
            lineHeight={1.3}
            opacity={0.7}
            whiteSpace="pre-line"
            px={8}
          >
            {contentDesc}
          </Text>
        )}
        {username && (
          <Stack isInline={true} justifyContent="center" alignItems="center">
            <Center w={4} h={4} minW={4} minH={4} maxW={4} maxH={4} mt={0.5}>
              <Image src={walletIcon} />
            </Center>
            <Text fontSize="lg" fontWeight="semibold">
              {username}
            </Text>
          </Stack>
        )}
        {addressButton && (
          <Box w="full" pt={2.5} px={8}>
            {addressButton}
          </Box>
        )}
        {bottomButton && (
          <Box w="full" pt={3.5}>
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
  const elementRef = useRef();
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
        w={{ base: '88vw', md: 'sm' }}
        justifyContent="center"
        alignItems="center"
        spacing={4}
        p={4}
      >
        {description && (
          <Text fontWeight="medium" textAlign="center" opacity={0.75}>
            {description}
          </Text>
        )}
        <Box px={2}>
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
              size={dimensions && dimensions.contentBox.width - 24}
              bgColor={'#ffffff'}
              fgColor={'#000000'}
              level={'L'}
              includeMargin={false}
            />
          </Center>
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
  const listRef = useRef(null);
  const [displayBlur, setDisplayBlur] = useState(false);

  useEffect(() => {
    if (listRef.current) {
      if (listRef.current.clientHeight >= 311) setDisplayBlur(true);
      const scrollHandler = () => {
        const height = Math.abs(
          listRef.current.scrollHeight -
            listRef.current.clientHeight -
            listRef.current.scrollTop
        );
        if (height < 1) setDisplayBlur(false);
        if (height >= 1) setDisplayBlur(true);
      };

      listRef.current.addEventListener('scroll', scrollHandler);
    }
  }, [listRef]);

  return (
    <AnimateBox
      initial="hidden"
      animate="enter"
      variants={ModalContentVariants}
    >
      <Grid
        ref={listRef}
        position="relative"
        templateColumns={{ base: '1fr', md: '1fr 1fr' }}
        templateRows={{ base: 'max-content', md: 'auto' }}
        columnGap={2.5}
        rowGap={1}
        maxH={80}
        minH={36}
        w={80}
        overflowY="scroll"
        paddingInline={0}
        py={0.5}
        px={4}
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
          return (
            <GridItem
              key={i}
              colSpan={{ base: 2, md: i > 1 ? 2 : 'auto' }}
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
                p={{ base: 2, md: i > 1 ? 2 : 3 }}
                py={{ md: i > 1 ? 2 : 7 }}
                mb={{ base: 0, md: i > 1 ? 0 : 1.5 }}
                justifyContent="start"
                borderRadius="md"
                whiteSpace="break-spaces"
                color={handleChangeColorModeValue(
                  colorMode,
                  'blackAlpha.800',
                  'whiteAlpha.800'
                )}
                transition="all .1s ease-in-out"
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
                  boxShadow: '0 0 0 1px #6A66FF',
                }}
                onClick={(e) => {
                  if (e.currentTarget.id === name) handleClick(walletsData[i]);
                }}
              >
                <Flex
                  w="full"
                  flexDirection={{ base: 'row', md: i > 1 ? 'row' : 'column' }}
                  justifyContent="start"
                  alignItems="center"
                >
                  <Box
                    borderRadius="lg"
                    overflow="hidden"
                    w={{ base: 8, md: i > 1 ? 8 : 14 }}
                    h={{ base: 8, md: i > 1 ? 8 : 14 }}
                    minW={{ base: 8, md: i > 1 ? 8 : 14 }}
                    minH={{ base: 8, md: i > 1 ? 8 : 14 }}
                    maxW={{ base: 8, md: i > 1 ? 8 : 14 }}
                    maxH={{ base: 8, md: i > 1 ? 8 : 14 }}
                    mr={{ base: 4, md: i > 1 ? 4 : 0 }}
                    mb={{ base: 0, md: i > 1 ? 0 : 3 }}
                  >
                    <Image src={typeof logo === 'string' && logo} />
                  </Box>
                  <Box textAlign="start" flex={1}>
                    <Text fontSize="sm" fontWeight="normal" lineHeight={1.1}>
                      {prettyName}
                    </Text>
                  </Box>
                </Flex>
              </Button>
            </GridItem>
          );
        })}
        <AnimateGridItem
          initial={false}
          animate={
            displayBlur
              ? {
                  opacity: 1,
                  height: 2,
                  transition: {
                    type: 'spring',
                    duration: 0.1,
                  },
                }
              : {
                  height: 0,
                  opacity: 0,
                  transition: {
                    type: 'spring',
                    duration: 0.2,
                  },
                }
          }
          position="sticky"
          bg={handleChangeColorModeValue(colorMode, '#fff', 'gray.700')}
          style={{ marginTop: 0 }}
          colSpan={2}
          bottom={-2}
          w="full"
          boxShadow={handleChangeColorModeValue(
            colorMode,
            '0 -3px 2px 2px #fff, 0 -4px 6px 2px #fff, 0 -4px 4px 2px #fff, 0 -5px 10px 2px #fff, 0 -8px 4px #fff, 0 -8px 6px 1px #fff, 0 -8px 8px 1px #fff',
            '0 -3px 2px 2px #2D3748, 0 -4px 6px 2px #2D3748, 0 -4px 4px 2px #2D3748, 0 -5px 10px 2px #2D3748, 0 -8px 4px #2D3748, 0 -8px 6px 1px #2D3748, 0 -8px 8px 1px #2D3748'
          )}
        ></AnimateGridItem>
      </Grid>
    </AnimateBox>
  );
};

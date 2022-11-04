import { Button, Center, Icon, Text, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { RiWallet3Fill } from 'react-icons/ri';

import { handleChangeColorModeValue } from './default-component';
import { ConnectWalletType } from './types';

const SIZES = {
  lg: { h: 12, fontSize: 'lg' },
  md: { h: 10, fontSize: 'md' },
  sm: { h: 8, fontSize: 'sm' },
};

const Variants = (colorMode: string) => ({
  primary: {
    bg: handleChangeColorModeValue(colorMode, 'primary.500', 'primary.400'),
    color: 'white',
    _hover: {
      bg: handleChangeColorModeValue(colorMode, 'primary.400', 'primary.500'),
    },
    _active: {
      bg: 'primary.50',
      color: handleChangeColorModeValue(
        colorMode,
        'primary.500',
        'primary.400'
      ),
      boxShadow: 'none',
    },
    _focus: { boxShadow: '0 0 0 2px #C47CCF' },
    _loading: {
      opacity: 0.8,
      bg: handleChangeColorModeValue(colorMode, 'primary.500', 'primary.400'),
      color: 'white',
      cursor: 'progress',
      _hover: {
        bg: handleChangeColorModeValue(colorMode, 'primary.500', 'primary.400'),
        color: 'white',
        boxShadow: 'none',
      },
      _active: {
        bg: handleChangeColorModeValue(colorMode, 'primary.500', 'primary.400'),
        color: 'white',
        boxShadow: 'none',
      },
      _focus: {
        bg: handleChangeColorModeValue(colorMode, 'primary.500', 'primary.400'),
        color: 'white',
        boxShadow: 'none',
      },
    },
    _disabled: {
      opacity: 0.8,
      bg: handleChangeColorModeValue(colorMode, 'gray.50', 'gray.700'),
      color: handleChangeColorModeValue(colorMode, 'gray.400', 'gray.500'),
      cursor: 'not-allowed',
      _hover: {
        bg: handleChangeColorModeValue(colorMode, 'gray.50', 'gray.700'),
        color: handleChangeColorModeValue(colorMode, 'gray.400', 'gray.500'),
        boxShadow: 'none',
      },
      _active: {
        bg: handleChangeColorModeValue(colorMode, 'gray.50', 'gray.700'),
        color: handleChangeColorModeValue(colorMode, 'gray.400', 'gray.500'),
        boxShadow: 'none',
      },
      _focus: {
        bg: handleChangeColorModeValue(colorMode, 'gray.50', 'gray.700'),
        color: handleChangeColorModeValue(colorMode, 'gray.400', 'gray.500'),
        boxShadow: 'none',
      },
    },
  },
  secondary: {
    bg: handleChangeColorModeValue(colorMode, 'gray.100', 'gray.600'),
    color: handleChangeColorModeValue(colorMode, 'gray.500', 'gray.200'),
    _hover: {
      bg: handleChangeColorModeValue(colorMode, 'gray.200', 'gray.700'),
    },
    _active: {
      bg: handleChangeColorModeValue(colorMode, 'gray.200', 'gray.700'),
      color: handleChangeColorModeValue(colorMode, 'gray.700', 'gray.50'),
    },
    _focus: { boxShadow: '0 0 0 2px #C47CCF' },
    _loading: {
      opacity: 0.8,
      bg: handleChangeColorModeValue(colorMode, 'gray.50', 'gray.700'),
      color: handleChangeColorModeValue(colorMode, 'gray.400', 'gray.500'),
      cursor: 'progress',
      _hover: {
        bg: handleChangeColorModeValue(colorMode, 'gray.50', 'gray.700'),
        color: handleChangeColorModeValue(colorMode, 'gray.400', 'gray.500'),
        boxShadow: 'none',
      },
      _active: {
        bg: handleChangeColorModeValue(colorMode, 'gray.50', 'gray.700'),
        color: handleChangeColorModeValue(colorMode, 'gray.400', 'gray.500'),
        boxShadow: 'none',
      },
      _focus: {
        bg: handleChangeColorModeValue(colorMode, 'gray.50', 'gray.700'),
        color: handleChangeColorModeValue(colorMode, 'gray.400', 'gray.500'),
        boxShadow: 'none',
      },
    },
    _disabled: {
      opacity: 0.8,
      bg: handleChangeColorModeValue(colorMode, 'gray.50', 'gray.700'),
      color: handleChangeColorModeValue(colorMode, 'gray.400', 'gray.500'),
      cursor: 'not-allowed',
      _hover: {
        bg: handleChangeColorModeValue(colorMode, 'gray.50', 'gray.700'),
        color: handleChangeColorModeValue(colorMode, 'gray.400', 'gray.500'),
        boxShadow: 'none',
      },
      _active: {
        bg: handleChangeColorModeValue(colorMode, 'gray.50', 'gray.700'),
        color: handleChangeColorModeValue(colorMode, 'gray.400', 'gray.500'),
        boxShadow: 'none',
      },
      _focus: {
        bg: handleChangeColorModeValue(colorMode, 'gray.50', 'gray.700'),
        color: handleChangeColorModeValue(colorMode, 'gray.400', 'gray.500'),
        boxShadow: 'none',
      },
    },
  },
  tertiary: {
    bg: 'transparent',
    boxShadow: handleChangeColorModeValue(
      colorMode,
      '0 0 0 1px #CBD5E0',
      '0 0 0 1px #718096'
    ),
    color: handleChangeColorModeValue(colorMode, 'gray.500', 'gray.300'),
    _hover: {
      bg: handleChangeColorModeValue(colorMode, 'gray.200', 'gray.700'),
    },
    _active: {
      bg: handleChangeColorModeValue(colorMode, 'gray.200', 'gray.700'),
      color: handleChangeColorModeValue(colorMode, 'gray.700', 'gray.50'),
    },
    _focus: {
      boxShadow: '0 0 0 2px #C47CCF',
      bg: 'transparent',
      color: handleChangeColorModeValue(colorMode, 'gray.500', 'gray.300'),
    },
    _loading: {
      opacity: 0.8,
      bg: handleChangeColorModeValue(colorMode, 'gray.50', 'gray.700'),
      color: handleChangeColorModeValue(colorMode, 'gray.400', 'gray.500'),
      boxShadow: handleChangeColorModeValue(
        colorMode,
        '0 0 0 1px #CBD5E0',
        '0 0 0 1px #718096'
      ),
      cursor: 'progress',
      _hover: {
        bg: handleChangeColorModeValue(colorMode, 'gray.50', 'gray.700'),
        color: handleChangeColorModeValue(colorMode, 'gray.400', 'gray.500'),
      },
      _active: {
        bg: handleChangeColorModeValue(colorMode, 'gray.50', 'gray.700'),
        color: handleChangeColorModeValue(colorMode, 'gray.400', 'gray.500'),
      },
      _focus: {
        bg: handleChangeColorModeValue(colorMode, 'gray.50', 'gray.700'),
        color: handleChangeColorModeValue(colorMode, 'gray.400', 'gray.500'),
      },
    },
    _disabled: {
      boxShadow: 'none',
      opacity: 0.8,
      bg: handleChangeColorModeValue(colorMode, 'gray.50', 'gray.700'),
      color: handleChangeColorModeValue(colorMode, 'gray.400', 'gray.500'),
      cursor: 'not-allowed',
      _hover: {
        bg: handleChangeColorModeValue(colorMode, 'gray.50', 'gray.700'),
        color: handleChangeColorModeValue(colorMode, 'gray.400', 'gray.500'),
      },
      _active: {
        bg: handleChangeColorModeValue(colorMode, 'gray.50', 'gray.700'),
        color: handleChangeColorModeValue(colorMode, 'gray.400', 'gray.500'),
      },
      _focus: {
        bg: handleChangeColorModeValue(colorMode, 'gray.50', 'gray.700'),
        color: handleChangeColorModeValue(colorMode, 'gray.400', 'gray.500'),
      },
    },
  },
});

export const ConnectWalletButton = ({
  size = 'md',
  buttonText,
  isLoading,
  isDisabled,
  variant = 'secondary',
  leftIcon,
  rightIcon,
  onClickConnectBtn,
}: ConnectWalletType) => {
  const { colorMode } = useColorMode();
  return (
    <Button
      px={2.5}
      w="full"
      h={SIZES[size as keyof typeof SIZES].h}
      display="flex"
      alignItems="center"
      fontSize={SIZES[size as keyof typeof SIZES].fontSize}
      isLoading={isLoading}
      isDisabled={isDisabled}
      onClick={onClickConnectBtn}
      {...Variants(colorMode)[variant as keyof ReturnType<typeof Variants>]}
    >
      {leftIcon ? (
        <Center mr={1.5}>{leftIcon}</Center>
      ) : (
        <Center mr={1.5}>
          <Icon as={RiWallet3Fill} />
        </Center>
      )}
      {buttonText ? <Text>{buttonText}</Text> : <Text>Connect Wallet</Text>}
      {rightIcon && <Center ml={1.5}>{rightIcon}</Center>}
    </Button>
  );
};

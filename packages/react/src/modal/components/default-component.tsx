/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  ButtonProps,
  Center,
  Divider,
  Icon,
  Image,
  Link as ChakraLink,
  Stack,
  Text,
  Tooltip,
  TooltipProps,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

import {
  DefaultCardType,
  DefaultIconButtonType,
  DefaultLinkItemType,
  DefaultLinkType,
  IconTypeProps,
} from './types';

// use for let color mode value fit Rules of Hooks
export function handleChangeColorModeValue(
  colorMode: string,
  light: string,
  dark: string
) {
  if (colorMode === 'light') return light;
  if (colorMode === 'dark') return dark;
}

// 🔧 use forwardRef to fix ref-warnings =>
// https://github.com/vercel/next.js/issues/7915#issuecomment-745117649
export const DefaultLink = React.forwardRef((props: any, ref) => {
  return (
    <ChakraLink
      w="full"
      ref={ref}
      _hover={{ textDecoration: 'none' }}
      _focus={{ outline: 'none' }}
      {...props}
    >
      {props.children}
    </ChakraLink>
  );
});

export const DefaultIconButton = ({
  icon,
  label,
  showTooltip,
  chakraButtonProps,
  chakraTooltipProps,
}: {
  chakraButtonProps?: ButtonProps;
  chakraTooltipProps?: TooltipProps;
} & DefaultIconButtonType) => {
  return showTooltip ? (
    <Tooltip
      label={label}
      hasArrow={true}
      bg={useColorModeValue('primary.300', 'primary.100')}
      {...chakraTooltipProps}
    >
      <Button
        boxShadow={useColorModeValue(
          '0 2px 5px -2px #d1d1d1',
          '0 1px 1px #535353, 0 3px 4px -1px #222'
        )}
        p={2.5}
        _focus={{ outline: 'none' }}
        {...chakraButtonProps}
      >
        <Icon as={icon} w={5} h={5} />
      </Button>
    </Tooltip>
  ) : (
    <Button
      boxShadow={useColorModeValue('0 2px 5px -2px #d1d1d1', '0 0 2px #555')}
      p={2.5}
      {...chakraButtonProps}
    >
      <Icon as={icon} w={5} h={5} />
    </Button>
  );
};

export const ListLinkButton = ({
  text,
  chakraButtonProps,
}: { chakraButtonProps?: ButtonProps } & DefaultLinkItemType) => {
  return (
    <Button
      variant="outline"
      boxShadow="base"
      w="full"
      h={12}
      borderRadius={5}
      {...chakraButtonProps}
    >
      {text}
    </Button>
  );
};

export const MenuLinkButton = ({
  icon,
  text,
  size = 'md',
}: DefaultLinkItemType) => {
  const { colorMode } = useColorMode();
  const SIZES = {
    lg: {
      h: 12,
      fontSize: 'lg',
    },
    md: {
      h: 10,
      fontSize: 'md',
    },
    sm: {
      h: 8,
      fontSize: 'sm',
    },
  };
  return (
    <Button
      title={text}
      display="flex"
      variant="ghost"
      justifyContent="start"
      alignItems="center"
      fontSize={SIZES[size as keyof typeof SIZES].fontSize}
      fontWeight="medium"
      textAlign="start"
      px={2}
      w="full"
      h="full"
      minH={SIZES[size as keyof typeof SIZES].h}
      maxH="fit-content"
      whiteSpace="break-spaces"
      lineHeight={1.1}
      _hover={{
        bg: handleChangeColorModeValue(colorMode, 'gray.200', 'gray.700'),
      }}
      _focus={{ boxShadow: '0 0 0 2px #C47CCF' }}
    >
      <Stack isInline={true} spacing={2} alignItems="center">
        {icon}
        <Text>{text}</Text>
      </Stack>
    </Button>
  );
};

export const TextWithIconLink = ({ text, icon }: DefaultLinkType) => (
  <Stack isInline={true} alignItems="center" spacing={1} opacity={0.7}>
    <Text fontWeight="semibold">{text}</Text>
    <Icon as={icon} />
  </Stack>
);

export const DefaultIcon = ({
  size = 'md',
  icon,
}: {
  size?: string;
  icon: IconTypeProps;
}) => {
  const SIZES = {
    lg: {
      imageSize: 9,
    },
    md: {
      imageSize: 8,
    },
    sm: {
      imageSize: 6,
    },
  };
  if (typeof icon === 'string')
    return (
      <Center
        borderRadius="full"
        overflow="hidden"
        w={SIZES[size as keyof typeof SIZES].imageSize}
        minW={SIZES[size as keyof typeof SIZES].imageSize}
        maxW={SIZES[size as keyof typeof SIZES].imageSize}
        h={SIZES[size as keyof typeof SIZES].imageSize}
        minH={SIZES[size as keyof typeof SIZES].imageSize}
        maxH={SIZES[size as keyof typeof SIZES].imageSize}
      >
        <Image
          w="full"
          alt={icon}
          src={icon}
          fallbackSrc={'https://dummyimage.com/200x200/cfcfcf/fff&text=X'}
        />
      </Center>
    );
  return (
    <Center
      borderRadius="full"
      overflow="hidden"
      w={SIZES[size as keyof typeof SIZES].imageSize}
      minW={SIZES[size as keyof typeof SIZES].imageSize}
      maxW={SIZES[size as keyof typeof SIZES].imageSize}
      h={SIZES[size as keyof typeof SIZES].imageSize}
      minH={SIZES[size as keyof typeof SIZES].imageSize}
      maxH={SIZES[size as keyof typeof SIZES].imageSize}
    >
      {icon}
    </Center>
  );
};

export const DefaultCard = ({ title, children }: DefaultCardType) => {
  return (
    <Box
      w="full"
      bg={useColorModeValue('white', 'gray.700')}
      boxShadow={useColorModeValue(
        '0 2px 3px #e3e3e3',
        '0 1px 3px #6e6e6e, 0 5px 12px -5px #858585'
      )}
      borderRadius="lg"
      p={6}
    >
      <Text fontWeight="semibold" fontSize="lg">
        {title}
      </Text>
      <Box mx={-6}>
        <Divider my={6} />
      </Box>
      {children}
    </Box>
  );
};

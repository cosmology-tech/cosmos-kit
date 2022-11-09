import { Box, Stack, useColorModeValue, Image, Text } from '@chakra-ui/react';
import { ChainCardProps } from '../types';

export const ChainCard = (props: ChainCardProps) => {
  return (
    <Stack
      isInline={true}
      alignItems="center"
      justifyContent={'center'}
      spacing={3}
      overflow="hidden"
      wordBreak="break-word"
      color={useColorModeValue('blackAlpha.800', 'whiteAlpha.800')}
      w="full"
    >
      <Box
        minW={10}
        minH={10}
        maxW={10}
        maxH={10}
        w="full"
        h="full"
        border="1px solid"
        borderColor={useColorModeValue('blackAlpha.200', 'whiteAlpha.200')}
        borderRadius="full"
        overflow="hidden"
      >
        <Image
          alt=""
          src={props.icon}
          fallbackSrc={'https://dummyimage.com/150/9e9e9e/ffffff&text=☒'}
        />
      </Box>
      <Text fontSize="xl" fontWeight="semibold" paddingEnd={'18px'}>
        {props.prettyName}
      </Text>
    </Stack>
  );
};

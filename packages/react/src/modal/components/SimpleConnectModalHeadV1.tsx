import { Box, Button, Icon, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { FiChevronLeft, FiX } from 'react-icons/fi';

import { SimpleModalHeadType } from './types';

export const SimpleModalHeadV1 = ({
  title,
  backButton,
  handleBack,
  handleClose,
}: SimpleModalHeadType) => {
  return (
    <Stack
      w="full"
      isInline={true}
      alignItems="center"
      h="fit-content"
      mb={2.5}
      p={4}
      pb={0}
    >
      {backButton && (
        <Button
          variant="ghost"
          borderRadius="full"
          px={0}
          _focus={{ outline: 'none' }}
          onClick={handleBack}
        >
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
      <Button
        variant="ghost"
        borderRadius="full"
        px={0}
        _focus={{ outline: 'none' }}
        onClick={handleClose}
      >
        <Icon as={FiX} w={5} h={5} />
      </Button>
    </Stack>
  );
};

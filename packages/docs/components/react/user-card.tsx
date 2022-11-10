import React from 'react';
import { Text, Stack, Box } from '@chakra-ui/react';
import { ConnectedUserCardType } from '../types';

export const ConnectedUserInfo = ({
  username,
  icon
}: ConnectedUserCardType) => {
  return (
    <Stack spacing={1} alignItems="center">
      {username && (
        <>
          <Box
            display={icon ? 'block' : 'none'}
            minW={20}
            maxW={20}
            w={20}
            minH={20}
            maxH={20}
            h={20}
            borderRadius="full"
            overflow="hidden"
          >
            {icon}
          </Box>
          <Text fontSize={{ md: 'xl' }} fontWeight="semibold">
            {username}
          </Text>
        </>
      )}
    </Stack>
  );
};

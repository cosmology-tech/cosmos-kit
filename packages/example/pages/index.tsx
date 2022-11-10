import { Center, Container } from '@chakra-ui/react';

import { WalletSection } from '../components';

export default function Home() {

  return (
    <Container maxW="5xl" py={10}>
      <Center mb={16}>
        <WalletSection />
      </Center>
    </Container>
  );
}

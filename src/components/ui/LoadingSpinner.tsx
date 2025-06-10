import React from 'react';
import { Spinner, Flex } from '@chakra-ui/react';

const LoadingSpinner = () => {
  return (
    <Flex justifyContent="center" alignItems="center" height="100vh">
      <Spinner size="xl" />
    </Flex>
  );
};

export default LoadingSpinner;
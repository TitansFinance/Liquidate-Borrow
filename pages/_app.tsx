/* eslint-disable */
// @ts-ignore
// @ts-nocheck
import React from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';

import { ModalProvider } from '@contexts/modal';
import { StoreProvider } from '@store/store';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <StoreProvider>
      <ChakraProvider>
        <ModalProvider>
          <Component {...pageProps} />
        </ModalProvider>
      </ChakraProvider>
    </StoreProvider>
  );
};

export default MyApp;

import React from 'react';
import { Box, Button, Text } from '@chakra-ui/react';

import { useModal } from '@contexts/modal';
import { useStore } from '@store/store';

type ConnectButtonProps = {}; // eslint-disable-line

const ConnectButton: React.FC<ConnectButtonProps> = ({}) => {
  const { store } = useStore();
  const { showConnectModal } = useModal();

  return store.account ? (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      background="#f76540"
      borderRadius="xl"
      py="0"
    >
      {/* <Box px="3">
        <Text color="white" fontSize="md">
          {store.balance} ETH
        </Text>
      </Box> */}
      <Button
        bg="gray.800"
        border="1px solid transparent"
        _hover={{
          border: '1px',
          borderStyle: 'solid',
          borderColor: 'blue.400',
          backgroundColor: 'gray.700',
        }}
        borderRadius="xl"
        m="1px"
        px={3}
        height="38px"
      >
        <Text color="white" fontSize="md" fontWeight="medium" mr="2">
          {store.account &&
            `${store.account.slice(0, 6)}...${store.account.slice(
              store.account.length - 4,
              store.account.length
            )}`}
        </Text>
        {/* <Identicon /> */}
      </Button>
    </Box>
  ) : (
    <Button
      onClick={showConnectModal}
      bg="#f76540"
      fontSize="lg"
      fontWeight="medium"
      borderRadius="3px"
      border="1px solid transparent"
      _hover={{
        borderColor: 'blue.700',
        color: 'blue.400',
      }}
      _active={{
        backgroundColor: 'blue.800',
        borderColor: 'blue.700',
      }}
    >
      <Text color="white" fontSize="md">
        CONNECT WALLET
      </Text>
    </Button>
  );
};

export default ConnectButton;

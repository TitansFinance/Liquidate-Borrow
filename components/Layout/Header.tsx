import React from 'react';
import { Flex, Image, Text } from '@chakra-ui/react';

import ConnectButton from '@components/Button/ConnectButton';

type HeaderProps = {}; // eslint-disable-line

const Header: React.FC<HeaderProps> = ({}) => {
  return (
    <Flex
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      px="100px"
      height="100px"
    >
      <Image width="80px" height="80px" src="logo.png" alt="logo" />
      <Flex justifyContent="center" alignItems="center">
        {/* <Text color="#f76540" fontSize="md" fontWeight="medium" mr="32px">
          Docs
        </Text>  */}
         <ConnectButton />
      </Flex>
    </Flex>
  );
};

export default Header;

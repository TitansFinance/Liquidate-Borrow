import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { utils } from 'ethers';

import { useModal } from '@contexts/modal';
import { useStore } from '@store/store';
import { StoreActionTypes } from '@type/store';
import { configMetamask, configWalletConnect } from '@utils/provider';

type ConnectModalProps = {}; //eslint-disable-line

const ConnectModal: React.FC<ConnectModalProps> = ({}) => {
  const { store, dispatch } = useStore();
  const { isConnectModalShown, hideConnectModal } = useModal();

  const [isMetamaskLoading, setIsMetamaskLoading] = useState(false);
  const [isWalletConnectLoading, setIsWalletConnectLoading] = useState(false);

  const handleConnectWallet = useCallback(
    async (wallet: string) => {
      wallet === 'WalletConnect'
        ? setIsWalletConnectLoading(true)
        : setIsMetamaskLoading(true);
      try {
        const { account, provider } =
          wallet === 'WalletConnect'
            ? await configWalletConnect(dispatch)
            : await configMetamask(dispatch);

        if (account) {
          const balance = await provider?.getBalance(account);
          balance &&
            dispatch({
              type: StoreActionTypes.SET_BALANCE,
              payload: { balance: utils.formatEther(balance) },
            });
        }
      } catch (error) {
        console.error(error);
      } finally {
        wallet === 'WalletConnect'
          ? setIsWalletConnectLoading(false)
          : setIsMetamaskLoading(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (store.account && isConnectModalShown) {
      hideConnectModal();
    }
  }, [store, hideConnectModal, isConnectModalShown]);

  return (
    <Modal isOpen={isConnectModalShown} onClose={hideConnectModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody bg="gray.800">
          <Flex justifyContent="center" alignItems="center" my="32px">
            <Text color="white" fontSize="24px">
              Connect Wallet
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              width="50%"
            >
              <Image
                height="64px"
                width="64px"
                src="metamask.svg"
                alt="metamask"
              />
              <Button
                isLoading={isMetamaskLoading}
                // spinner={<BeatLoader size={8} color="white" />}
                onClick={() => handleConnectWallet('MetaMask')}
                width="50%"
                height="80px"
                bg="transparent"
                color="gray.300"
                fontSize="md"
                fontWeight="medium"
                _hover={{
                  borderColor: 'blue.700',
                  color: 'blue.400',
                }}
                _active={{
                  backgroundColor: 'blue.800',
                  borderColor: 'blue.700',
                }}
              >
                MetaMask
              </Button>
            </Flex>
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              width="50%"
            >
              <Image
                height="64px"
                width="64px"
                src="walletconnect.svg"
                alt="metamask"
              />
              <Button
                isLoading={isWalletConnectLoading}
                // spinner={<BeatLoader size={8} color="white" />}
                onClick={() => handleConnectWallet('WalletConnect')}
                width="50%"
                height="80px"
                bg="transparent"
                color="gray.300"
                fontSize="md"
                fontWeight="medium"
                _hover={{
                  borderColor: 'gray.700',
                  color: 'gray.400',
                }}
                _active={{
                  backgroundColor: 'gray.800',
                  borderColor: 'gray.700',
                }}
              >
                WalletConnect
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ConnectModal;

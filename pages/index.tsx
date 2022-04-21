/* eslint-disable */
// @ts-ignore
// @ts-nocheck
import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import {
  Button, Flex, Text, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl, Input,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import window from 'global'


import NFTSwap from '@components/Form/NFTSwap'
import NFTTrade from '@components/Form/NFTTrade'
import NFTMint from '@components/Form/NFTMint'
import Header from '@components/Layout/Header'
import Trade from '@components/Form/Trade'
import Web3 from 'web3'
import comp_abi from '../ABI/Comptroller.json'
import ctoken_abi from '../ABI/CToken.json'
import underlying_abi from '../ABI/Underlying.json'
const HomePage: NextPage = () => {

  const web3 = new Web3(window.ethereum)


  const [showLaunch, setShowLaunch] = useState(false)
  const [showFactory, setShowFactory] = useState(false)
  const [showTrade, setShowTrade] = useState(false)
  const [showNFTmint, setShowNFTMint] = useState(false)


  const [borrAdd, setBorrAdd] = useState("")
  const [amount, setAmount] = useState("")
  const [collAdd, setCollAdd] = useState("")
  const [cadd, setCAdd] = useState("")
  const [account, setAccount] = useState("")
  const compAdd = "0xC1aB2E0d34c7c0981E514Af7fB0BeFDF10B680f0"
  const toast = useToast();




  const handleShowLaunch = () => setShowLaunch(!showLaunch)
  const handleShowFactory = () => setShowFactory(!showFactory)
  const handleShowTrade = () => setShowTrade(!showTrade)
  const handleShowNFTMint = () => setShowNFTMint(!showNFTmint)


  async function getAccount() {

    web3.eth.getAccounts().then((rec) => {
      setAccount(rec[0])
    })

  }
  getAccount()
  console.log(account)
  const comp_instance = new web3.eth.Contract(comp_abi, compAdd)

  function handleBorrAdd(e: any) {
    setBorrAdd(e.target.value)
  }
  function handleAmount(e: any) {
    setAmount(e.target.value)
  }
  function handleCollAdd(e: any) {
    setCollAdd(e.target.value)
  }
  function handleCAdd(e: any) {
    setCAdd(e.target.value)
  }
  const { isOpen: isAppOpen, onOpen: onAppOpen, onClose: onAppClose } = useDisclosure()
  const { isOpen: isLiqOpen, onOpen: onLiqOpen, onClose: onLiqClose } = useDisclosure()
  const { isOpen: isGetOpen, onOpen: onGetOpen, onClose: onGetClose } = useDisclosure()
  const { isOpen: isBalOpen, onOpen: onBalOpen, onClose: onBalClose } = useDisclosure()
  const { isOpen: isRedOpen, onOpen: onRedOpen, onClose: onRedClose } = useDisclosure()

  async function handleReedem(e: any) {
    try {
      const ctoken_instance = new web3.eth.Contract(ctoken_abi, cadd)
      const result = await ctoken_instance.methods.redeem(amount).send({ from: account })
      toast({
        title: 'Tokens Redeemed',
        description: 'Check your balance to verify',
        status: 'success',
        duration: 6000,
        isClosable: true,
      });


    }
    catch (error) {
      console.log(error)
      toast({
        title: 'Error',
        status: 'error',
        duration: 6000,
        isClosable: true,
      });
    }

  }

  async function handleApproval(e: any) {
    const amount_wei = web3.utils.toWei(amount, 'ether')
    console.log(borrAdd, amount_wei, cadd)

    const underlying_instance = new web3.eth.Contract(underlying_abi, cadd)
    underlying_instance.methods.approve(borrAdd, amount_wei).send({ from: account })
      .on('receipt', function (receipt) {
        console.log(receipt)
        toast({
          title: 'Tokens Approved',
          status: 'success',
          duration: 6000,
          isClosable: true,
        });
      })
      .on('error', function (error) {
        console.log(error)
        toast({
          title: 'Error',
          status: 'error',
          duration: 6000,
          isClosable: true,
        });
      })
  }


  async function handleLiq(e: any) {
    const amount_wei = web3.utils.toWei(amount, 'ether')
    console.log(borrAdd, amount_wei, collAdd, cadd)
    const ctoken_instance = new web3.eth.Contract(ctoken_abi, cadd)
    ctoken_instance.methods.liquidateBorrow(borrAdd, amount_wei, collAdd).send({ from: account })
      .on('receipt', function (receipt) {
        console.log(receipt)

        toast({
          title: 'Liquidation is Complete',
          status: 'success',
          duration: 6000,
          isClosable: true,
        });
      })
      .on('error', function (error) {
        console.log(error)
        toast({
          title: 'Error',
          status: 'error',
          duration: 6000,
          isClosable: true,
        });
      })

  }
  async function handleGet(e: any) {
    try {
      comp_instance.methods.getAccountLiquidity(borrAdd).call({ from: account }).then(function (res) {
        console.log(res)
        let st = `Error- ${res[0]} ,Liqudity-${res[1]} & Shortfall-${res[2]} `
        toast({
          title: 'Result',
          description: st,
          status: 'success',
          duration: 6000,
          isClosable: true,
        });
      })
    }
    catch (error) {
      console.log(error)
      toast({
        title: 'Error',
        status: 'error',
        duration: 6000,
        isClosable: true,
      });


    }
    // comp_instance.methods.getAccountLiquidity(borrAdd).call({from:account})
    // .on('Result', function (Result) {
    //          console.log(Result)

    //   toast({
    //     title: {result},
    //     status: 'success',
    //     duration: 6000,
    //     isClosable: true,
    //   });
    // })
    // .on('error', function (error) {
    //   console.log(error)
    //   toast({
    //     title: 'Error',
    //     status: 'error',
    //     duration: 6000,
    //     isClosable: true,
    //   });
    // })

    //     .on('receipt',function(receipt){
    //       console.log(receipt)
    //     })
    // .on('error',function(error){
    //   console.log(error)
    // })


  }

  async function handleBalance(e: any) {
    console.log(cadd)
    const ctoken_instance = new web3.eth.Contract(ctoken_abi, cadd)

    try {
      const result = await ctoken_instance.methods.balanceOf(account).call({ from: account })
      console.log(result)
      toast({
        title: `Balance is ${result}`,
        status: 'success',
        duration: 6000,
        isClosable: true,
      });
    }
    catch (error) {
      console.log(error)
      toast({
        title: 'Error',
        status: 'error',
        duration: 6000,
        isClosable: true,
      });
    }
    // .on('receipt', function (receipt) {
    //          console.log(receipt)

    //   toast({
    //     title: {receipt},
    //     status: 'success',
    //     duration: 6000,
    //     isClosable: true,
    //   });
    // })
    // .on('error', function (error) {
    //   console.log(error)
    // toast({
    //   title: 'Error',
    //   status: 'error',
    //   duration: 6000,
    //   isClosable: true,
    // });
    // })

  }

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
    >
      <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minWidth="1400"
      >
        <Header />


        <Flex
          flexDirection="column"
          justifyContent="flex-start"
          width="100%"
          height="100%"
          ml="440px"
          mt="200px"
        >
          <Text fontWeight="bold" fontSize="36px">
            Liquidate Borrow
          </Text>
          <br />
          <br /><br />

          <Flex alignItems="center" mt="32px">
            <Button
              onClick={onGetOpen}
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
              width="180px"
              height="48px"
            >
              <Text color="white" fontSize="md">
                Get Account Liquidity
              </Text>
            </Button>
            <Modal isOpen={isGetOpen} onClose={onGetClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Account Liquidity Form</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl isRequired mt='24px'>
                    <Input
                      id="token"
                      type="token"
                      onChange={handleBorrAdd}
                      placeholder="Borrower Address"
                      mt="24px"
                    />


                    <br />
                    <br />

                    <Button
                      bg="#f76540"
                      fontSize="lg"
                      fontWeight="medium"
                      borderRadius="3px"
                      border="1px solid transparent"
                      onClick={handleGet}
                      _hover={{
                        borderColor: 'blue.700',
                        color: 'blue.400',
                      }}
                      _active={{
                        backgroundColor: 'blue.800',
                        borderColor: 'blue.700',
                      }}>
                      <Text color="white" fontSize="md">Submit </Text>

                    </Button>
                  </FormControl>
                </ModalBody>
              </ModalContent>
            </Modal>
          </Flex>
          <Flex alignItems="center" mt="32px">
            <Button
              onClick={onAppOpen}
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
              width="180px"
              height="48px"
            >
              <Text color="white" fontSize="md">
                Approval
              </Text>
            </Button>
            <Modal isOpen={isAppOpen} onClose={onAppClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Approval Form</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl isRequired mt='24px'>
                    <Input
                      id="token"
                      type="token"
                      onChange={handleBorrAdd}
                      placeholder="Receiver Address"
                      mt="24px"
                    />
                    <Input
                      id="token"
                      type="token"
                      onChange={handleCAdd}
                      placeholder="Underlying Token Address"
                      mt="24px"
                    />

                    <Input
                      id="token"
                      type="token"
                      onChange={handleAmount}
                      placeholder="Amount"
                      mt="24px"
                    />


                    <br />
                    <br />

                    <Button
                      bg="#f76540"
                      fontSize="lg"
                      fontWeight="medium"
                      borderRadius="3px"
                      border="1px solid transparent"
                      onClick={handleApproval}
                      _hover={{
                        borderColor: 'blue.700',
                        color: 'blue.400',
                      }}
                      _active={{
                        backgroundColor: 'blue.800',
                        borderColor: 'blue.700',
                      }}>
                      <Text color="white" fontSize="md">Approve </Text>

                    </Button>
                  </FormControl>
                </ModalBody>
              </ModalContent>
            </Modal>
            {/* <Text color="gray.600" width="500px" ml="32px">
                Swap your NFTs here with other user{' '}
              </Text> */}
          </Flex>
          <Flex alignItems="center" mt="32px">
            <Button
              onClick={onLiqOpen}
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
              width="180px"
              height="48px"
            >
              <Text color="white" fontSize="md">
                Liquidate Borrow
              </Text>
            </Button>
            <Modal isOpen={isLiqOpen} onClose={onLiqClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Liquidate Form</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl isRequired mt='24px'>
                    <Input
                      id="token"
                      type="token"
                      onChange={handleBorrAdd}
                      placeholder="Borrower Address"
                      mt="24px"
                    />

                    <Input
                      id="token"
                      type="token"
                      onChange={handleAmount}
                      placeholder="Repay Amount"
                      mt="24px"
                    />
                    <Input
                      id="token"
                      type="token"
                      onChange={handleCollAdd}
                      placeholder="Token Collateral Address"
                      mt="24px"
                    /> <Input
                      id="token"
                      type="token"
                      onChange={handleCAdd}
                      placeholder="C Token Address"
                      mt="24px"
                    />
                    <br />
                    <br />

                    <Button
                      bg="#f76540"
                      fontSize="lg"
                      fontWeight="medium"
                      borderRadius="3px"
                      border="1px solid transparent"
                      onClick={handleLiq}
                      _hover={{
                        borderColor: 'blue.700',
                        color: 'blue.400',
                      }}
                      _active={{
                        backgroundColor: 'blue.800',
                        borderColor: 'blue.700',
                      }}>
                      <Text color="white" fontSize="md">Liquidate </Text>

                    </Button>
                  </FormControl>
                </ModalBody>
              </ModalContent>
            </Modal>
          </Flex>
          <Flex alignItems="center" mt="32px">
            <Button
              onClick={onBalOpen}
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
              width="180px"
              height="48px"
            >
              <Text color="white" fontSize="md">
                Get Balance
              </Text>
            </Button>
            <Modal isOpen={isBalOpen} onClose={onBalClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Get Balance Of C-Token</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl isRequired mt='24px'>
                    <Input
                      id="token"
                      type="token"
                      onChange={handleCAdd}
                      placeholder="C-Token Address"
                      mt="24px"
                    />

                    <br />
                    <br />

                    <Button
                      bg="#f76540"
                      fontSize="lg"
                      fontWeight="medium"
                      borderRadius="3px"
                      border="1px solid transparent"
                      onClick={handleBalance}
                      _hover={{
                        borderColor: 'blue.700',
                        color: 'blue.400',
                      }}
                      _active={{
                        backgroundColor: 'blue.800',
                        borderColor: 'blue.700',
                      }}>
                      <Text color="white" fontSize="md">Get Balance</Text>

                    </Button>
                  </FormControl>
                </ModalBody>
              </ModalContent>
            </Modal>
          </Flex>

          <Flex alignItems="center" mt="32px">

            <Button
              onClick={onRedOpen}

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
              width="180px"
              height="48px"
            >
              <Text color="white" fontSize="md">
                Redeem
              </Text>
            </Button>
            {/* <Text color="gray.600" width="500px" ml="32px">
                Swap your NFTs here with other user{' '}
              </Text> */}
            <Modal isOpen={isRedOpen} onClose={onRedClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Redeem C-Token to Underlying Token</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl isRequired mt='24px'>
                    <Input
                      id="token"
                      type="token"
                      onChange={handleCAdd}
                      placeholder="C-Token Address"
                      mt="24px"
                    />
                    <Input
                      id="token"
                      type="token"
                      onChange={handleAmount}
                      placeholder="Amount"
                      mt="24px"
                    />

                    <br />
                    <br />

                    <Button
                      bg="#f76540"
                      fontSize="lg"
                      fontWeight="medium"
                      borderRadius="3px"
                      border="1px solid transparent"
                      onClick={handleReedem}
                      _hover={{
                        borderColor: 'blue.700',
                        color: 'blue.400',
                      }}
                      _active={{
                        backgroundColor: 'blue.800',
                        borderColor: 'blue.700',
                      }}>
                      <Text color="white" fontSize="md">Redeem</Text>

                    </Button>
                  </FormControl>
                </ModalBody>
              </ModalContent>
            </Modal>
          </Flex>
        </Flex>
        <br />
        <br />
        <br />
      </Flex>

    </Flex>

  )
}

export default HomePage

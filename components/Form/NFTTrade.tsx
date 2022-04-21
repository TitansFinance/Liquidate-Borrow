/* eslint-disable */
// @ts-ignore
// @ts-nocheck

import React, { useState, useEffect } from 'react';

import {
  Button,
  Flex,
  FormControl,
  Input,
  Select,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';

import Web3 from "web3";
import {
  contract_address_nft1,
  contract_address_nft2,
  contract_address_nft3,
  contract_address_escrow,
    weth_address,
  contract_abi_nft,
  contract_abi_escrow,
  weth_abi,
} from './config_personal';

var web3 = ''




type NFTTradeProps = {
  onClose: () => void;
}; // eslint-disable-line





const NFTTrade: React.FC<NFTTradeProps> = ({ onClose }) => {
  const { isOpen: isApproveOpen, onOpen: onApproveOpen, onClose: onApproveClose } = useDisclosure()
  const { isOpen: isExeOpen, onOpen: onExeOpen, onClose: onExeClose } = useDisclosure()
  const { isOpen: isExeTipOpen, onOpen: onExeTipOpen, onClose: onExeTipClose } = useDisclosure()
  const { isOpen: isWETHOpen, onOpen: onWETHOpen, onClose: onWETHClose } = useDisclosure()

  useEffect(async () => {
    // await loadweb3()
  }, [])

  const [account, SetAccount] = useState("")


  async function getAccount(web3) {
    let accounts = ""
    web3.eth.getAccounts().then((rec) => {
      accounts = rec
      SetAccount(accounts[0])

    })

  }


  web3 = new Web3(window.ethereum)

  getAccount(web3)
  const [tokenID, setTokenID] = useState("");
  const [amount, setAmount] = useState('');
  const [fromID, setFromID] = useState('');
  const [toID, setToID] = useState("")
  const [address, setAddress] = useState("")
  const [NFTaddress, setNFTaddress] = useState("")
  const [tip, SetTip] = useState("")
  const [NFTFrom, setNFTFrom] = useState("")
  const [NFTTo, setNFTTo] = useState("")
  const [tradeID, setTradeID] = useState("")

  // const [whitelist,setWhitelist] = useState("")
  // const [isAddRec,setIsAddRec] = useState(false)
  // const [isIDRec,setIsIDRec] = useState(false)
  // const [txHash,setTxHash] = useState("")
  const toast = useToast();

  const contractInstanceEscrow = new web3.eth.Contract(contract_abi_escrow, contract_address_escrow)
  function handleTradeID(e: any) {
    setTradeID(e.target.value)
  }
  function handleTokenID(e: any) {
    setTokenID(e.target.value)
  }
  function handleAmount(e: any) {
    setAmount(e.target.value)

  }
  function handleTip(e: any) {
    setTip(e.target.value)

  }
  function handleFromID(e: any) {
    setFromID(e.target.value)

  }
  function handleToID(e: any) {
    setToID(e.target.value)

  }
  function handleAddress(e: any) {
    setAddress(e.target.value)

  }
  function handleNFTaddress(e: any) {
    setNFTaddress(e.target.value)
  }
  function handleNFTFrom(e: any) {
    setNFTFrom(e.target.value)
  }
  function handleNFTTo(e: any) {
    setNFTTo(e.target.value)
  }

  function handleApprove(e: any) {
    const contractInstanceNFT = new web3.eth.Contract(contract_abi_nft, NFTaddress)
    console.log(tokenID, NFTaddress)
    contractInstanceNFT.methods.approve(contract_address_escrow, tokenID).send({ from: account })
      .on('receipt', function (receipt) {
        toast({
          title: 'NFT Approved',
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



  async function handleApproveWETH(e: any) {
    const tip_amount = await contractInstanceEscrow.methods.platformTip().call({ from: account })
    const contractInstanceWETH = new web3.eth.Contract(weth_abi, weth_address)
    contractInstanceWETH.methods.approve(contract_address_escrow,tip_amount).send({from:account})
    .on('receipt', function (receipt) {
      toast({
        title: 'WETH Approved',
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
  async function handleExecuteTrade(e: any) {


    console.log(tradeID)
    const nft_amount = await contractInstanceEscrow.methods.tradePrice(tradeID).call({ from: account })

    contractInstanceEscrow.methods.executeTrade(tradeID).send({
      from: account,
      value: nft_amount
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
      .on('receipt', function (receipt) {
        let string = "Transaction Hash is " + JSON.stringify(receipt.transactionHash)
        toast({
          title: 'Trade Executed',
          description: string,
          status: 'success',
          duration: 10000,
          isClosable: true,
        });
      })
  }



  async function handleExecuteTradeWithTip(e: any) {
    //     const tip =0.1
    // const total_amount = tip + parseFloat(amount)
    // console.log(total_amount)
    //     const amount_wei = web3.utils.toWei(total_amount.toString(), 'ether')
    //     const amount_value_wei = web3.utils.toWei(amount.toString(),'ether')


    // var batch = new web3.eth.BatchRequest()
    // console.log(batch)
    // batch.add(contractInstanceNFT.methods.approve(contract_address_escrow, fromID).send.request
    //   .on('receipt', function (receipt) {
    //     let string = "Transaction Hash is " + JSON.stringify(receipt.transactionHash)
    //     toast({
    //       title: 'Trade Executed',
    //       description: string,
    //       status: 'success',
    //       duration: 6000,
    //       isClosable: true,
    //     });
    //   }))

    // batch.add(contractInstanceEscrow.methods.executeTrade(amount_wei, fromID, toID, address).send.request({
    //   from: account,
    //   value: amount_wei
    // }).on('error', function (error) {
    //   console.log(error)
    //   toast({
    //     title: 'Error',
    //     status: 'error',
    //     duration: 6000,
    //     isClosable: true,
    //   });
    // }))
    // batch.execute();
    console.log(tradeID)
    const nft_amount = await contractInstanceEscrow.methods.tradePrice(tradeID).call({ from: account })

    contractInstanceEscrow.methods.executeTradeWithTip(tradeID).send({
      from: account,
      value: nft_amount
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
      .on('receipt', function (receipt) {
        let string = "Transaction Hash is " + JSON.stringify(receipt.transactionHash)
        toast({
          title: 'Trade Executed',
          description: string,
          status: 'success',
          duration: 10000,
          isClosable: true,
        });
      })

  }





  // const handleShowToast = () =>
  //   toast({
  //     title: 'Account created.',
  //     description: "We've created your account for you.",
  //     status: 'success',
  //     duration: 6000,
  //     isClosable: true,
  //   });

  // const handleTokenChange = (e: any) => {
  //   setToken(e.target.value);
  //   setIsIDRec(true)
  // }
  // const handleNftChange = (e: any) => setNft(e.target.value); // eslint-disable-line

  // //  function handleAddress(e:any) {
  // //   setAddress(e.target.value)
  // //   setIsAddRec(true)

  // // }

  // async function handleWhitelistSubmit() {
  //   if (isAddRec) {
  //     contractInstance_proxy.methods.isAllowed(address).call({ PUBLIC_KEY })
  //       .then(function (result) {
  //         if (result) {
  //           setWhitelist("Whitelisted")
  //           toast({
  //             title: 'Whitelisted.',
  //             description: "You are good to go!!",
  //             status: 'success',
  //             duration: 6000,
  //             isClosable: true,
  //           });

  //         }
  //       })

  //       .catch(function (error) {
  //         setWhitelist("Not Whitelisted")
  //         toast({
  //           title: 'Not Whitelisted.',
  //           description: "Please get your KYC done.",
  //           status: 'error',
  //           duration: 6000,
  //           isClosable: true,
  //         });
  //       })
  //   }
  //   else {
  //     alert("Enter Address")
  //   }


  // }
  // async function handleMintSubmit(e: any) {
  //   e.preventDefault()
  //   if (isAddRec == true && isIDRec == true) {
  //     contractInstance_mole.methods.safeMint(address, token).send({ PUBLIC_KEY })
  //       .on('receipt', async function (receipt) {
  //         let result = receipt.transactionHash
  //         setTxHash(receipt.transactionHash)
  //         let string = "Transaction Hash - " + JSON.stringify(result)
  //         console.log(string)
  //         toast({
  //           position: 'top',
  //           title: ' Molecule NFT Minted',
  //           description: string,
  //           status: 'info',
  //           duration: 10000,
  //           isClosable: true,
  //           containerStyle: {
  //             width: '800px',
  //             maxWidth: '100%',
  //           },

  //         })





  //       })
  //       .catch(function (error) {
  //         console.log(error)
  //         toast({
  //           position: 'top',
  //           title: 'Error',
  //           description: "Please Try Again!!",
  //           status: 'error',
  //           duration: 6000,
  //           isClosable: true,
  //         });
  //       })



  //   }
  //   else {
  //     toast({
  //       title: 'Error',
  //       description: "Enter Details Properly",
  //       status: 'error',
  //       duration: 6000,
  //       isClosable: true,
  //     });

  //   }

  // }
  // async function handleBurnSubmit(e: any) {
  //   e.preventDefault()
  //   if (isAddRec == true && isIDRec == true) {
  //     e.preventDefault()
  //     const result = await contractInstance_mole.methods._burn(address, token).send({ PUBLIC_KEY })
  //     console.log(result)
  //     alert("Token Burned")
  //   }
  //   else {
  //     alert("Enter Address and Token ID properly")
  //   }

  // }




  return (
    <>

      <Flex flexDirection="column" width="800px" justifyContent="space-between">
        <Text fontWeight="bold" fontSize="36px">
          Trade NFTs
        </Text>
        <Text color="gray.600" width="600px" fontSize="14px">
          Trade your NFTs with other users by negotiating on your terms
        </Text>

        <FormControl isRequired mt="24px">
          <br />
          <br />
          <br />
          <br />


        </FormControl>
        <Flex mt="24px">
          <Button
            onClick={onApproveOpen}
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
            }}>
            <Text color="white" fontSize="md">Approve Your NFT</Text>
          </Button>
          <Modal isOpen={isApproveOpen} onClose={onApproveClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Approval Form</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl isRequired mt='24px'>
                  <Input
                    id="token"
                    type="token"
                    onChange={handleTokenID}
                    placeholder="Token ID"
                    mt="24px"
                  />

                  <Input
                    id="token"
                    type="token"
                    onChange={handleNFTaddress}
                    placeholder="NFT Contract Address"
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
                    onClick={handleApprove}
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
          <Button
            onClick={handleApproveWETH}
            bg="#f76540"
            fontSize="lg"
            fontWeight="medium"
            borderRadius="3px"
            border="1px solid transparent"
            ml="35px"

            _hover={{
              borderColor: 'blue.700',
              color: 'blue.400',
            }}
            _active={{
              backgroundColor: 'blue.800',
              borderColor: 'blue.700',
            }}>
            <Text color="white" fontSize="md">Approve WETH</Text>
          </Button>
          {/* <Modal isOpen={isWETHOpen} onClose={onWETHClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>WETH Approval Form</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl isRequired mt='24px'>
                  <Input
                    id="token"
                    type="token"
                    onChange={handleTokenID}
                    placeholder="Token ID"
                    mt="24px"
                  />

                  <Input
                    id="token"
                    type="token"
                    onChange={handleNFTaddress}
                    placeholder="NFT Contract Address"
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
                    onClick={handleApprove}
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
          </Modal> */}
          <Button

            bg="#f76540"
            fontSize="lg"
            fontWeight="medium"
            borderRadius="3px"
            border="1px solid transparent"
            onClick={onExeOpen}
            ml="35px"
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
              Execute Trade
            </Text>
          </Button>
          <Modal isOpen={isExeOpen} onClose={onExeClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Execute Trade Form</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl isRequired mt='24px'>
 
                  <Input

                    onChange={handleTradeID}
                    placeholder="Trade ID"
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
                    onClick={handleExecuteTrade}
                    _hover={{
                      borderColor: 'blue.700',
                      color: 'blue.400',
                    }}
                    _active={{
                      backgroundColor: 'blue.800',
                      borderColor: 'blue.700',
                    }}
                    ml="35px">
                    <Text color="white" fontSize="md">Execute </Text>

                  </Button>
                </FormControl>
              </ModalBody>
            </ModalContent>
          </Modal>


          <Button
            bg="#f76540"
            fontSize="lg"
            fontWeight="medium"
            borderRadius="3px"
            border="1px solid transparent"
            onClick={onExeTipOpen}
            _hover={{
              borderColor: 'blue.700',
              color: 'blue.400',
            }}
            _active={{
              backgroundColor: 'blue.800',
              borderColor: 'blue.700',
            }}
            ml="35px"
          >
            <Text color="white" fontSize="md" >
              Execute Trade with Tip
            </Text>
            <Modal isOpen={isExeTipOpen} onClose={onExeTipClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Execute Trade with Tip Form</ModalHeader>

                <ModalCloseButton />
                <ModalBody>
                  <FormControl isRequired mt='24px'>

                    <Input

                      onChange={handleTradeID}
                      placeholder="Trade ID"
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
                      onClick={handleExecuteTradeWithTip}
                      _hover={{
                        borderColor: 'blue.700',
                        color: 'blue.400',
                      }}
                      _active={{
                        backgroundColor: 'blue.800',
                        borderColor: 'blue.700',
                      }}
                      ml="35px">
                      <Text color="white" fontSize="md">Execute</Text>

                    </Button>
                    <ModalFooter>Default Tip is 0.1ETH</ModalFooter>
                  </FormControl>

                </ModalBody>
              </ModalContent>
            </Modal>
          </Button>
           </Flex>
 <Flex mt="48px">

                        <Button
            onClick={onClose}
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
            }}>
            <Text color="white" fontSize="md">Back to Main Menu</Text>
            </Button>

                </Flex>
        <br />
        <br />
        <br />
      </Flex>
    </>
  );
};

export default NFTTrade;

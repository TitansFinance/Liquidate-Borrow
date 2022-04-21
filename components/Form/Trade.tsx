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
    contract_address_nft,
    contract_address_escrow,
    contract_abi_nft,
    contract_abi_escrow
} from './config_personal';
import { stringify } from 'querystring';

var web3 = ''


type TradeProps = {
    onClose: () => void;
}; // eslint-disable-line

const Trade: React.FC<TradeProps> = ({ onClose }) => {
    const { isOpen: isCreateOfferOpen, onOpen: onCreateOfferOpen, onClose: onCreateOfferClose } = useDisclosure()
    const { isOpen: isAcceptOfferOpen, onOpen: onAcceptOfferOpen, onClose: onAcceptOfferClose } = useDisclosure()
    const { isOpen: isWithdrawOfferOpen, onOpen: onWithdrawOfferOpen, onClose: onWithdrawOfferClose } = useDisclosure()
    const { isOpen: isSwapOpen, onOpen: onSwapOpen, onClose: onSwapClose } = useDisclosure()





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
    const [fromID, setFromID] = useState([]);
    const [toID, setToID] = useState([])
    const [address, setAddress] = useState("")
    const [NFTaddress, setNFTaddress] = useState("")
    const [tip, SetTip] = useState("")
    const [NFTFrom, setNFTFrom] = useState([])
    const [NFTTo, setNFTTo] = useState([])
    const [tradeID, setTradeID] = useState("")
    const [tradeIDCounter,settradeIDCounter] = useState("")
    const toast = useToast();
    const contractInstanceEscrow = new web3.eth.Contract(contract_abi_escrow, contract_address_escrow)

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
        let a  = e.target.value
  let b = a.split(',')
  b= b.map(Number)
  console.log(b)
        setFromID(b)

    }
    function handleToID(e: any) {
        let a  = e.target.value
  let b = a.split(',')
  b= b.map(Number)
  console.log(b)
        setToID(b)

    }
    function handleAddress(e: any) {
        setAddress(e.target.value)

    }
    function handleNFTaddress(e: any) {
        setNFTaddress(e.target.value)
    }
    function handleNFTFrom(e: any) {
        let a  = e.target.value
  let b = a.split(',')
  console.log(b)
        setNFTFrom(b)
    }
    function handleNFTTo(e: any) {
        let a  = e.target.value
  let b = a.split(',')
  console.log(b)
        setNFTTo(b)
    }
    function handleTradeID(e: any) {
        setTradeID(e.target.value)
    }

    async function handleCreateSwap(e:any){
        const amount_wei = web3.utils.toWei(amount.toString(), 'ether')

        contractInstanceEscrow.methods.createOfferSwap(amount_wei,address,fromID,toID,NFTFrom,NFTTo).send({from:account})
        .on('receipt', function (receipt) {
            let str = "Trade ID for Swap is :"+JSON.stringify(receipt.events.TradeId.returnValues._tradeId)
            console.log(receipt.events.TradeId.returnValues._tradeId)
            toast({
                title: 'NFT Swap Created',
                description: str,
                status: 'success',
                duration: 10000,
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

    async function handleCreateOffer(e: any) {
        const amount_wei = web3.utils.toWei(amount.toString(), 'ether')


         contractInstanceEscrow.methods.createOffer(amount_wei, address, toID,NFTTo).send({ from: account })
            .on('receipt', function (receipt) {
                let str = "Trade ID is :"+JSON.stringify(receipt.events.TradeId.returnValues._tradeId)
                console.log(receipt.events.TradeId.returnValues._tradeId)
                toast({
                    title: 'Trade Created',
                    description: str,
                    status: 'success',
                    duration: 10000,
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
// console.log("expected result...", result)
// console.log(result.events.TradeId.returnValues)
// console.log(result.events.TradeId.returnValues._tradeId)
// console.log(result.events.TradeId.returnValues[1])

// if(result){
//     toast({
//         title: 'Trade Created',
//         description: result,
//         status: 'success',
//         duration: 10000,
//         isClosable: true,
//     });

//}
    }


    function handleAcceptOffer(e: any) {
        contractInstanceEscrow.methods.acceptOffer(tradeID).send({ from: account })
            .on('receipt', function (receipt) {
                console.log(receipt)
                toast({
                    title: 'Trade Accepted',

                    status: 'success',
                    duration: 10000,
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
    function handleWithdrawOffer(e: any) {
        contractInstanceEscrow.methods.withdrawOffer(tradeID).send({ from: account })
            .on('receipt', function (receipt) {
                console.log(receipt)
                toast({
                    title: 'Trade Withdrawn',

                    status: 'success',
                    duration: 10000,
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


    return (
        <>
            <Flex flexDirection="column" width="800px" justifyContent="space-between">
                <Text fontWeight="bold" fontSize="36px">
                    Create your Offers here
                </Text>
                <Text color="gray.600" width="600px" fontSize="14px">
                    Trade your NFTs with other users by negotiating on your terms<br/>
                    *For Muliple Listing , add "," between tokenID and NFT address 
                </Text>

                <FormControl isRequired mt="24px">
                    <br />
                    <br />
                    <br />
                    <br />


                </FormControl>
                <Flex mt="24px">
                    <Button
                        onClick={onCreateOfferOpen}
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
                        <Text color="white" fontSize="md">Create Trade</Text>
                    </Button>
                    <Modal isOpen={isCreateOfferOpen} onClose={onCreateOfferClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Create Trade Form</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <FormControl isRequired mt='24px'>
                                    <FormControl isRequired mt='24px'>
                                        <Input

                                            onChange={handleAmount}
                                            placeholder="Amount"
                                            mt="24px"
                                        />

                                        <Input

                                            onChange={handleToID}
                                            placeholder=" Token ID"
                                            mt="24px"
                                        />
          
                                        <Input
                                            id="token"
                                            type="token"
                                            onChange={handleNFTTo}
                                            placeholder="NFT Contract Address "
                                            mt="24px"
                                        />
                                        <Input

                                            onChange={handleAddress}
                                            placeholder="Recipient Address"
                                            mt="24px"
                                        />



                                    </FormControl>
                                    <br />
                                    <br />

                                    <Button
                                        bg="#f76540"
                                        fontSize="lg"
                                        fontWeight="medium"
                                        borderRadius="3px"
                                        border="1px solid transparent"
                                        onClick={handleCreateOffer}
                                        _hover={{
                                            borderColor: 'blue.700',
                                            color: 'blue.400',
                                        }}
                                        _active={{
                                            backgroundColor: 'blue.800',
                                            borderColor: 'blue.700',
                                        }}>
                                        <Text color="white" fontSize="md">Create Trade </Text>

                                    </Button>
                                </FormControl>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                    <Button
                        onClick={onSwapOpen}
                        bg="#f76540"
                        ml="35px"
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
                        <Text color="white" fontSize="md">Create Swap</Text>
                    </Button>
                    <Modal isOpen={isSwapOpen} onClose={onSwapClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Create Offer Form</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <FormControl isRequired mt='24px'>
                                    <FormControl isRequired mt='24px'>
                                        <Input

                                            onChange={handleAmount}
                                            placeholder="Amount"
                                            mt="24px"
                                        />

                                        <Input

                                            onChange={handleFromID}
                                            placeholder="From Token ID"
                                            mt="24px"
                                        />

                                        <Input

                                            onChange={handleToID}
                                            placeholder="To Token ID"
                                            mt="24px"
                                        />
                                        <Input
                                            id="token"
                                            type="token"
                                            onChange={handleNFTFrom}
                                            placeholder="NFT Contract Address (From)"
                                            mt="24px"
                                        />
                                        <Input
                                            id="token"
                                            type="token"
                                            onChange={handleNFTTo}
                                            placeholder="NFT Contract Address (To)"
                                            mt="24px"
                                        />
                                        <Input

                                            onChange={handleAddress}
                                            placeholder="Recipient Address"
                                            mt="24px"
                                        />



                                    </FormControl>
                                    <br />
                                    <br />

                                    <Button
                                        bg="#f76540"
                                        fontSize="lg"
                                        fontWeight="medium"
                                        borderRadius="3px"
                                        border="1px solid transparent"
                                        onClick={handleCreateSwap}
                                        _hover={{
                                            borderColor: 'blue.700',
                                            color: 'blue.400',
                                        }}
                                        _active={{
                                            backgroundColor: 'blue.800',
                                            borderColor: 'blue.700',
                                        }}>
                                        <Text color="white" fontSize="md">Create Swap </Text>

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
                        onClick={onAcceptOfferOpen}
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
                            Accept Offer
                        </Text>
                    </Button>
                    <Modal isOpen={isAcceptOfferOpen} onClose={onAcceptOfferClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Accept Offer Form</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <FormControl isRequired mt='24px'>
                                    <Input

                                        onChange={handleTradeID}
                                        placeholder="TradeID"
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
                                        onClick={handleAcceptOffer}
                                        _hover={{
                                            borderColor: 'blue.700',
                                            color: 'blue.400',
                                        }}
                                        _active={{
                                            backgroundColor: 'blue.800',
                                            borderColor: 'blue.700',
                                        }}
                                        ml="35px">
                                        <Text color="white" fontSize="md">Accept Offer </Text>

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
                        onClick={onWithdrawOfferOpen}
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
                            Withdraw Offer
                        </Text>
                        <Modal isOpen={isWithdrawOfferOpen} onClose={onWithdrawOfferClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Withdraw Offer Form </ModalHeader>

                                <ModalCloseButton />
                                <ModalBody>
                                    <FormControl isRequired mt='24px'>
                                        <Input

                                            onChange={handleTradeID}
                                            placeholder="TradeID"
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
                                            onClick={handleWithdrawOffer}
                                            _hover={{
                                                borderColor: 'blue.700',
                                                color: 'blue.400',
                                            }}
                                            _active={{
                                                backgroundColor: 'blue.800',
                                                borderColor: 'blue.700',
                                            }}
                                            ml="35px">
                                            <Text color="white" fontSize="md">Withdraw Offer</Text>

                                        </Button>
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

    )

}
// export {amount,tradeID}

export default Trade;

/* eslint-disable */
// @ts-ignore
// @ts-nocheck
import React, { useState,useEffect } from 'react';
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
import Web3 from "web3";

type NFTMintProps = {
  onClose: () => void;
}; // eslint-disable-line

var web3 = ''

const NFTMint: React.FC<NFTMintProps> = ({ onClose }) => {
        const toast = useToast();


  useEffect(async ()=>{
    // await loadweb3()
  } ,[])
    const [account,SetAccount] = useState("")
      async function getAccount(web3) {
  let accounts = ""
   web3.eth.getAccounts().then((rec) =>{
     accounts = rec
     SetAccount(accounts[0])
     
   })

  }

  web3 = new Web3(window.ethereum)
 
 getAccount(web3)
 
 
 async function handleNFTMint1(e: any){
     const uri = "https://ipfs.io/ipfs/QmeBkvHNz9Rf8bGmHqdReuKjKRa4uyoYrLVt4XzzpabJii?filename=orc.json"
 const contractInstanceNFT = new web3.eth.Contract(contract_abi_nft, contract_address_nft1)
 contractInstanceNFT.methods.safeMint(account).send({from:account})
 .then(function(receipt){
     let str = "Token ID of minted NFT is :"+JSON.stringify(receipt.events.Transfer.returnValues.tokenId)
  
       toast({
                title: 'NFT minted',
                description: str,
                status: 'success',
                duration: 10000,
                isClosable: true,
            });
     
 })
//    .on('receipt', function (receipt) {
//             let str = "Token ID of minted NFT is :"+JSON.stringify(receipt.events.Transfer.returnValues.tokenID)
//             console.log(receipt.events.Transfer.returnValues.tokenID)
//             toast({
//                 title: 'NFT minted',
//                 description: str,
//                 status: 'success',
//                 duration: 10000,
//                 isClosable: true,
//             });
//         })
//         .on('error', function (error) {
//             console.log(error)
//             toast({
//                 title: 'Error',
//                 status: 'error',
//                 duration: 6000,
//                 isClosable: true,
//             });
//         })



 }
  async function handleNFTMint2(e: any){
      const uri = "https://ipfs.io/ipfs/QmZH5gGf6ijowc2hGApiUXwVXAcwCXVEMrcTH6s5VhtL1F?filename=knight.json"
       const contractInstanceNFT = new web3.eth.Contract(contract_abi_nft, contract_address_nft2)
 contractInstanceNFT.methods.safeMint(account).send({from:account})
 .then(function(receipt){
     let str = "Token ID of minted NFT is :"+JSON.stringify(receipt.events.Transfer.returnValues.tokenId)
  
       toast({
                title: 'NFT minted',
                description: str,
                status: 'success',
                duration: 10000,
                isClosable: true,
            });
     
 })
  }
  async function handleNFTMint3(e: any){
      const uri = "https://ipfs.io/ipfs/QmT3nSKpJrEUWgeqGNiQPNEWcP2cousZNfQ72qX8qnBtWk?filename=elf.json"
 const contractInstanceNFT = new web3.eth.Contract(contract_abi_nft, contract_address_nft3)
 contractInstanceNFT.methods.safeMint(account).send({from:account})
 .then(function(receipt){
     let str = "Token ID of minted NFT is :"+JSON.stringify(receipt.events.Transfer.returnValues.tokenId)
  
       toast({
                title: 'NFT minted',
                description: str,
                status: 'success',
                duration: 10000,
                isClosable: true,
            });
     
 })
  }

  return(
       <>

      <Flex flexDirection="column" width="800px" justifyContent="space-between">
        <Text fontWeight="bold" fontSize="36px">
Mint NFTs from 3 collections        </Text>
        <Text color="gray.600" width="600px" fontSize="14px">
Click on any 3 button below and Metamask Trasaction will pop up, confirm it and minted NFT would be in your wallet        </Text>

        <FormControl isRequired mt="24px">
          <br />


        </FormControl>
          <Flex mt="24px">
          <Button
            onClick={handleNFTMint1}
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
            <Text color="white" fontSize="md">Collection 1</Text>
          </Button>

          <Button
            onClick={handleNFTMint2}
            bg="#f76540"
            fontSize="lg"
            fontWeight="medium"
            borderRadius="3px"
            ml="35px"

            border="1px solid transparent"
            _hover={{
              borderColor: 'blue.700',
              color: 'blue.400',
            }}
            _active={{
              backgroundColor: 'blue.800',
              borderColor: 'blue.700',
            }}>
            <Text color="white" fontSize="md">Collection 2</Text>
          </Button>

          <Button
            onClick={handleNFTMint3}
            bg="#f76540"
            fontSize="lg"
            fontWeight="medium"
            borderRadius="3px"
            ml="35px"

            border="1px solid transparent"
            _hover={{
              borderColor: 'blue.700',
              color: 'blue.400',
            }}
            _active={{
              backgroundColor: 'blue.800',
              borderColor: 'blue.700',
            }}>
            <Text color="white" fontSize="md">Collection 3</Text>
          </Button>
          </Flex>
          
          <Flex mt="16px"> <Text color="gray.600" width="600px" fontSize="14px">Collection 1 Address - {contract_address_nft1}</Text></Flex>
                    <Flex mt="16px"><Text color="gray.600" width="600px" fontSize="14px">Collection 2 Address - {contract_address_nft2}</Text></Flex>
          <Flex mt="16px"><Text color="gray.600" width="600px" fontSize="14px">Collection 3 Address - {contract_address_nft3}</Text></Flex>

                        <Flex mt="24px">

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
        </Flex>
        </>
  )
}

export default NFTMint;

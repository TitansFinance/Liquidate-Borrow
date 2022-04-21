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
} from '@chakra-ui/react';

import Web3 from "web3";
import {

  contract_address_nft,
  contract_address_escrow,
  contract_abi_nft,
  contract_abi_escrow
} from './config_personal';

// import {StoreContext,StoreProvider,useStore} from '@store/store.tsx'

// const try_abc = StoreProvider
// console.log(StoreProvider)
// console.log(StoreContext)
// console.log(useStore)
var web3 = ''




type LaunchFormProps = {
  onClose: () => void;
}; // eslint-disable-line


//const web3 = new Web3(web3_provider)
//const web3 = new Web3(window.ethereum)
// console.log(web3)
// const amount = web3.utils.toWei('50', 'ether')
// const wallet = web3.eth.accounts.wallet.add({
//   privateKey: PRIVATE_KEY,
//   address: PUBLIC_KEY
// });



 const LaunchForm: React.FC<LaunchFormProps> = ({ onClose }) => {
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
  const [tokenID, setTokenID] = useState('');
  const [amount, setAmount] = useState('');
  const [fromID, setFromID] = useState('');
  const [toID, setToID] = useState("")
  const [address, setAddress] = useState("")
  // const [whitelist,setWhitelist] = useState("")
  // const [isAddRec,setIsAddRec] = useState(false)
  // const [isIDRec,setIsIDRec] = useState(false)
  // const [txHash,setTxHash] = useState("")
  const toast = useToast();
  // const [renderOnce,setRenderOnce] = useState(false)

  // const contractInstanceNFT = new web3.eth.Contract(contract_abi_nft, contract_address_nft, {
  //   from: PUBLIC_KEY,
  //   gasLimit: web3.utils.toHex(1000000),
  //   gasPrice: web3.utils.toHex(50e9),
  // })
  // const contractInstanceEscrow = new web3.eth.Contract(contract_abi_escrow, contract_address_escrow, {
  //   from: PUBLIC_KEY,
  //   gasLimit: web3.utils.toHex(1000000),
  //   gasPrice: web3.utils.toHex(50e9),
  // })
  const contractInstanceNFT = new web3.eth.Contract(contract_abi_nft, contract_address_nft)
  const contractInstanceEscrow = new web3.eth.Contract(contract_abi_escrow, contract_address_escrow)

  function handleTokenID(e: any) {
    setTokenID(e.target.value)

  }
  function handleAmount(e: any) {
    setAmount(e.target.value)

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

  function handleApprove(e: any) {
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
  function handleExecuteTrade(e: any) {
    const amount_wei = web3.utils.toWei(amount.toString(),'ether')
    console.log(amount_wei)
    console.log(amount_wei.toString())
    

    contractInstanceEscrow.methods.executeTrade(amount_wei, fromID, toID, address).send({
      from: account,
      value: amount_wei
    })
      .on('receipt', function (receipt) {
        let string = "Transaction Hash is " + JSON.stringify(receipt.transactionHash)
        toast({
          title: 'Trade Executed',
          description: string,
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
    <Flex flexDirection="column" width="600px" justifyContent="space-between">
      <Text fontWeight="bold" fontSize="36px">
        Trade NFTs
      </Text>
      <Text color="gray.600" width="600px" fontSize="14px">
        Trade your NFTs with other users by negotiating on your terms
      </Text>
      <FormControl isRequired mt="24px">

        <Input
          id="token"
          type="token"
          onChange={handleTokenID}
          placeholder="Token ID"
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
          <Text color="white" fontSize="md">Approve Your NFT</Text>

        </Button>
        <br />
        <br />
        <br />
        <br />



        <Input

          onChange={handleAmount}
          placeholder="Amount"
          mt="24px"
        />
        <Input

          onChange={handleFromID}
          placeholder="From Token ID"
          mt="24px"
        />       <Input

          onChange={handleToID}
          placeholder="To Token ID"
          mt="24px"
        />       <Input

          onChange={handleAddress}
          placeholder="Recipient Address"
          mt="24px"
        />
      </FormControl>
      <Flex mt="24px">
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
        >
          <Text color="white" fontSize="md">
            Execute Trade
          </Text>
        </Button>
        {/* 
        <Button
          bg="#f76540"
          fontSize="lg"
          fontWeight="medium"
          borderRadius="3px"
          border="1px solid transparent"
          onClick={handleWhitelistSubmit}
          _hover={{
            borderColor: 'blue.700',
            color: 'blue.400',
          }}
          _active={{
            backgroundColor: 'blue.800',
            borderColor: 'blue.700',
          }}
          ml="24px"
        >
          <Text color="white" fontSize="md" >
            Is Whitelisted?
          </Text>
        </Button> */}
        {/* <Button
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
          }}
          ml="24px"
        >
          <Text color="white" fontSize="md">
            Go Back!!
          </Text>
        </Button> */}
      </Flex>
      {/* {render_tx_mint()} */}
      <br />
      <br />
      <br />




    </Flex>
  );
};

export default LaunchForm;

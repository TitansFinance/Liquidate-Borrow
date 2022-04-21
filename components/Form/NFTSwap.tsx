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


type NFTSwapProps = {
  onClose: () => void;
}; // eslint-disable-line

var web3 = ''

const NFTSwap: React.FC<NFTSwapProps> = ({ onClose }) => {

  useEffect(async ()=>{
    // await loadweb3()
  } ,[])
  const { isOpen: isApproveOpen, onOpen: onApproveOpen, onClose: onApproveClose } = useDisclosure()
  const { isOpen: isExeOpen, onOpen: onExeOpen, onClose: onExeClose } = useDisclosure()
  const { isOpen: isExeTipOpen, onOpen: onExeTipOpen, onClose: onExeTipClose } = useDisclosure()
  const { isOpen: isWETHOpen, onOpen: onWETHOpen, onClose: onWETHClose } = useDisclosure()


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
 const [tokenID, setTokenID] = useState("");
 const [amount, setAmount] = useState('');
 const [fromID, setFromID] = useState([]);
 const [toID, setToID] = useState([])
 const [address, setAddress] = useState("")
 const [NFTaddress, setNFTaddress] = useState("")
 const [tip, SetTip] = useState("")
 const [NFTFrom,setNFTFrom] = useState([])
 const [NFTTo,setNFTTo] = useState([])
 const [tradeID,setTradeID] = useState("")
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
function handleTradeID(e:any){
  setTradeID(e.target.value)
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
  setToID(b)

}
function handleAddress(e: any) {
  setAddress(e.target.value)

}
function handleNFTaddress(e: any) {
  setNFTaddress(e.target.value)
}
function handleNFTFrom(e:any){
  let a  = e.target.value
  let b = a.split(',')
  setNFTFrom(b)
}
function handleNFTTo(e:any){
  let a  = e.target.value
  let b = a.split(',')
  setNFTTo(b)
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



  // const contractInstanceNFT = new web3.eth.Contract(contract_abi_nft, NFTaddress)
  // console.log(contractInstanceNFT)
  // console.log(tokenID,NFTaddress)
  // var batch = new web3.eth.BatchRequest()
  // for (let i=0;i<tokenID.length;i++){
  //   console.log(tokenID[i])
  //   batch.add(contractInstanceNFT.methods.approve(contract_address_escrow,tokenID[i]).send.request({from:account}))
  // }
  // batch.execute()


  // contractInstanceNFT.methods.approve(contract_address_escrow, tokenID).send({ from: account })
  //   .on('receipt', function (receipt) {
  //     toast({
  //       title: 'NFT Approved',
  //       status: 'success',
  //       duration: 6000,
  //       isClosable: true,
  //     });
  //   })
  //   .on('error', function (error) {
  //     console.log(error)
  //     toast({
  //       title: 'Error',
  //       status: 'error',
  //       duration: 6000,
  //       isClosable: true,
  //     });
  //   })
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

  async function handleExeSwap(e:any){
    console.log(tradeID)
    const nft_amount = await contractInstanceEscrow.methods.tradePrice(tradeID).call({ from: account })

    contractInstanceEscrow.methods.executeSwap(tradeID).send({
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
          title: 'Swap Executed',
          description: string,
          status: 'success',
          duration: 10000,
          isClosable: true,
        });
      })
  }

  async function handleExeSwapTip(pe:any) {
    console.log(tradeID)
    const nft_amount = await contractInstanceEscrow.methods.tradePrice(tradeID).call({ from: account })

    contractInstanceEscrow.methods.executeSwapWithTip(tradeID).send({
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
//   function handleExecuteTrade(e: any) {
//     const amount_wei = web3.utils.toWei(amount.toString(), 'ether')
//     console.log(amount_wei, fromID, toID, address,NFTFrom,NFTTo)
//     contractInstanceEscrow.methods.multipleTrade(amount_wei, fromID, toID, address,NFTFrom,NFTTo).send({
//       from: account,
//       value: amount_wei
//     })
//     .on('error', function (error) {
//       console.log(error)
//       toast({
//         title: 'Error',
//         status: 'error',
//         duration: 6000,
//         isClosable: true,
//       });
//     })
//     .on('receipt', function (receipt) {
//           let string = "Transaction Hash is " + JSON.stringify(receipt.transactionHash)
//           toast({
//             title: 'Trade Executed',
//             description: string,
//             status: 'success',
//             duration: 10000,
//             isClosable: true,
//           });
//         })
// }
// function handleExecuteTradeWithTip(e: any) {
//   const tip =0.1
//   const total_amount = tip + parseFloat(amount)
//   console.log(total_amount)
//   const amount_wei = web3.utils.toWei(total_amount.toString(), 'ether')
//   const amount_value_wei = web3.utils.toWei(amount.toString(),'ether')
//   console.log(amount_wei, fromID, toID, address,NFTFrom,NFTTo)
//     contractInstanceEscrow.methods.multipleTradeWithTip(amount_value_wei, fromID, toID, address,NFTFrom,NFTTo).send({
//         from: account,
//         value: amount_wei
//       })
//       .on('error', function (error) {
//         console.log(error)
//         toast({
//           title: 'Error',
//           status: 'error',
//           duration: 6000,
//           isClosable: true,
//         });
//       })
//       .on('receipt', function (receipt) {
//             let string = "Transaction Hash is " + JSON.stringify(receipt.transactionHash)
//             toast({
//               title: 'Trade Executed',
//               description: string,
//               status: 'success',
//               duration: 10000,
//               isClosable: true,
//             });
//           })

//   }




  // const [first, setFirst] = useState('');
  // const [second, setSecond] = useState('');
  // const [third, setThird] = useState('');
  // const [forth, setForth] = useState('');

  // const handleFirstChange = (e: any) => setFirst(e.target.value); // eslint-disable-line
  // const handleSecondChange = (e: any) => setSecond(e.target.value); // eslint-disable-line
  // const handleThirdChange = (e: any) => setThird(e.target.value); // eslint-disable-line
  // const handleForthChange = (e: any) => setForth(e.target.value); // eslint-disable-line


  return (
   
    // <Flex flexDirection="column" width="400px" justifyContent="space-between">
    //   <Text fontWeight="bold" fontSize="36px">
    //     Molecule Factory
    //   </Text>
    //   <Text color="gray.600" width="360px" fontSize="14px">
    //     Select up to 4 NFT smart contracts for whitelisting
    //   </Text>
    //   <FormControl isRequired mt="24px">
    //     <Input
    //       id="first"
    //       type="text"
    //       value={first}
    //       onChange={handleFirstChange}
    //       placeholder="NFT Smart Contract Address 1"
    //       mt="24px"
    //     />
    //     <Input
    //       id="second"
    //       type="text"
    //       value={second}
    //       onChange={handleSecondChange}
    //       placeholder="NFT Smart Contract Address 2"
    //       mt="24px"
    //     />
    //     <Input
    //       id="third"
    //       type="text"
    //       value={third}
    //       onChange={handleThirdChange}
    //       placeholder="NFT Smart Contract Address 3"
    //       mt="24px"
    //     />
    //     <Input
    //       id="forth"
    //       type="text"
    //       value={forth}
    //       onChange={handleForthChange}
    //       placeholder="NFT Smart Contract Address 4"
    //       mt="24px"
    //     />
    //   </FormControl>
    //   <Flex mt="24px">
    //     <Button
    //       onClick={() => null}
    //       bg="#f76540"
    //       fontSize="lg"
    //       fontWeight="medium"
    //       borderRadius="3px"
    //       border="1px solid transparent"
    //       _hover={{
    //         borderColor: 'blue.700',
    //         color: 'blue.400',
    //       }}
    //       _active={{
    //         backgroundColor: 'blue.800',
    //         borderColor: 'blue.700',
    //       }}
    //     >
    //       <Text color="white" fontSize="md">
    //         Create Molecule
    //       </Text>
    //     </Button>
    //     <Button
    //       onClick={onClose}
    //       bg="#f76540"
    //       fontSize="lg"
    //       fontWeight="medium"
    //       borderRadius="3px"
    //       border="1px solid transparent"
    //       _hover={{
    //         borderColor: 'blue.700',
    //         color: 'blue.400',
    //       }}
    //       _active={{
    //         backgroundColor: 'blue.800',
    //         borderColor: 'blue.700',
    //       }}
    //       ml="24px"
    //     >
    //       <Text color="white" fontSize="md">
    //         X
    //       </Text>
    //     </Button>
    //   </Flex>
    // </Flex>




  <>

      <Flex flexDirection="column" width="800px" justifyContent="space-between">
        <Text fontWeight="bold" fontSize="36px">
          Swap NFTs
        </Text>
        <Text color="gray.600" width="600px" fontSize="14px">
          Swap multiple tokens here by just placing your TradeID
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
              Execute Swap
            </Text>
          </Button>
          <Modal isOpen={isExeOpen} onClose={onExeClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Execute Swap Form</ModalHeader>
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
                    onClick={handleExeSwap}
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
              Execute Swap with Tip
            </Text>
            <Modal isOpen={isExeTipOpen} onClose={onExeTipClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Execute Swap with Tip Form</ModalHeader>

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
                      onClick={handleExeSwapTip}
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

export default NFTSwap;

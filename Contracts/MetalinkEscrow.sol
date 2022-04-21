// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0<0.9.0;

interface IERC721 {
    function balanceOf(address sender) external view returns(uint);
    function transferFrom(address from, address to, uint256 tokenId ) external;
    function approve(address to, uint256 tokenId) external;
    function safeTransferFrom( address from, address to, uint256 tokenId) external;
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function getApproved(uint256 tokenId) external view returns (address operator);
    function isExist(uint256 tokenId) external view returns (bool);
}

interface IWETH9 {
    
    function transferFrom(address src, address dst, uint wad) external returns (bool);
}

library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}

contract MetalinkEscrow {

    address public owner;
    uint  public platformTip;
    address payable public tipAddress;
    address public WETH;
    uint public tradeIdCounter = 0;
   
   mapping (uint => address payable) public senderAddress;
   // trade id to sender address
   mapping (uint => address) public recieverAddress;
   // trade id to reciever address
   mapping (uint => mapping (address => bool)) public tradeGate;
   // trade id to sender address to trade gate status used for withdrawal 
   mapping (uint => mapping (address => bool)) public tradeStatus;
   // trade id to reciever address to trade access status
   mapping (uint => uint ) public offerDeadline;
   // trade id to offer deadline mapping 
   mapping (uint => uint ) public tradeDeadline;
   // trade id to trade deadline mapping 
   mapping (uint => uint) public tradePrice;
   // trade id to price 
   mapping (uint => uint[]) public tradeTokenId1;
   // trade id to trade tokens for user 1  
    mapping (uint => uint[]) public tradeTokenId2;
   // trade id to trade tokens for user 2  
    mapping (uint => address[]) public tradeNft1;
   // trade id to trade NFT token contract address  for user 1  
    mapping (uint => address[]) public tradeNft2;
   // trade id to trade NFT token contract address  for user 2  

   // event for trade ID 
    event TradeId(uint _tradeId);
   
    constructor()   {
        owner = msg.sender;
    }
    modifier onlyOwner {
        require(msg.sender == owner, "You are not the owner.");
        _;
    } 

    function setPlatformTip (uint  _platformTip) public onlyOwner {
        platformTip = _platformTip;
    } 

    function setTipAddress (address payable _tipAddress) public onlyOwner {
        tipAddress = _tipAddress;
    } 

    function setWethAddress (address  _WETH) public onlyOwner {
        WETH = _WETH;
    } 

    function tradeIdGenerator() private returns(uint){
        tradeIdCounter = tradeIdCounter + 1;
        return tradeIdCounter;
    }
    
    function createOfferSwap(uint price,address reciever,uint[] memory tokenId1,uint[] memory tokenId2, address[] memory contractAddress1, address[] memory contractAddress2) public  returns(uint){
        uint tradeId = tradeIdGenerator();
        offerDeadline[tradeId] = block.timestamp + (15*60);
        senderAddress[tradeId] = payable(msg.sender);
        recieverAddress[tradeId] = reciever;
        tradePrice[tradeId] = price;
        tradeTokenId1[tradeId] = tokenId1;
        tradeTokenId2[tradeId] = tokenId2;
        tradeNft1[tradeId] = contractAddress1;
        tradeNft2[tradeId] = contractAddress2;
        tradeGate[tradeId][msg.sender] = true;
         emit TradeId(tradeId);
        return tradeId;
    } 

     function createOfferTrade(uint price,address reciever,uint[] memory tokenId1,address[] memory contractAddress1) public  returns(uint){
        uint tradeId = tradeIdGenerator();
        offerDeadline[tradeId] = block.timestamp + (15*60);
        senderAddress[tradeId] = payable(msg.sender);
        recieverAddress[tradeId] = reciever;
        tradePrice[tradeId] = price;
        tradeTokenId1[tradeId] = tokenId1;
        tradeNft1[tradeId] = contractAddress1;
        tradeGate[tradeId][msg.sender] = true;
         emit TradeId(tradeId);
        return tradeId;
    } 

    function acceptOffer(uint tradeId) public returns(bool){
        address sender = senderAddress[tradeId];
        require(tradeGate[tradeId][sender] == true,"Trade withdrawn by sender");
        require(msg.sender == recieverAddress[tradeId],"Invalid Token Reciever");
        require(block.timestamp <= offerDeadline[tradeId],"Offer Expired");
        tradeDeadline[tradeId] = block.timestamp + (15*60);
        tradeStatus[tradeId][msg.sender] = true;
        return true;
    }

    function withdrawOffer(uint tradeId) public returns(bool){
        require(msg.sender == senderAddress[tradeId]);
        address reciever = recieverAddress[tradeId];
        require(tradeStatus[tradeId][reciever] == false,"Offer Already accepted");
        tradeGate[tradeId][msg.sender] = false;
        tradeStatus[tradeId][reciever] = false;
        return true;
    }
 
    function executeTrade(uint tradeId) payable public returns(bool){
        uint price = tradePrice[tradeId];
        require(msg.value >= price,"price less than expected");
        require(tradeStatus[tradeId][msg.sender] == true , "Trade is not accepted or authorized");
        require(block.timestamp <= tradeDeadline[tradeId],"Trade window Expired");
        address payable sender = senderAddress[tradeId];
        uint[] memory tokenId = tradeTokenId1[tradeId];
        address[] memory contractAddress = tradeNft1[tradeId]; 
        trade(sender,msg.sender,tokenId,contractAddress);
        sender.transfer(msg.value);
        return true;
    }

    function executeTradeWithTip(uint tradeId) payable public returns(bool){
        uint price = tradePrice[tradeId];
        require(msg.value >= price,"price less than expected");
        require(tradeStatus[tradeId][msg.sender] == true , "Trade is not accepted or authorized");
        require(block.timestamp <= tradeDeadline[tradeId],"Trade window Expired");
        address payable sender = senderAddress[tradeId];
        uint[] memory tokenId = tradeTokenId1[tradeId];
        address[] memory contractAddress = tradeNft1[tradeId]; 
        trade(sender,msg.sender,tokenId,contractAddress);
        if (msg.value > price){
            uint additionalprice = SafeMath.sub(msg.value,price);
            tipAddress.transfer(additionalprice);
        }
        IWETH9(WETH).transferFrom(msg.sender,tipAddress,platformTip);
        IWETH9(WETH).transferFrom(sender,tipAddress,platformTip);
        sender.transfer(price);
        return true;
    }
     
    function executeSwap(uint tradeId) payable public returns(bool){
        uint price = tradePrice[tradeId];
        require(msg.value >= price,"price less than expected");
        require(tradeStatus[tradeId][msg.sender] == true , "Trade is not accepted or authorized");
        require(block.timestamp <= tradeDeadline[tradeId],"Trade window Expired");
        address payable sender = senderAddress[tradeId];
        uint[] memory tokenId1 = tradeTokenId1[tradeId];
        uint[] memory tokenId2 = tradeTokenId2[tradeId];
        address[] memory contractAddress1 = tradeNft1[tradeId]; 
        address[] memory  contractAddress2 = tradeNft2[tradeId]; 
        trade(msg.sender,sender,tokenId2,contractAddress2);
        trade(sender,msg.sender,tokenId1,contractAddress1);
        sender.transfer(msg.value);
        return true;
    }

    function executeSwapWithTip(uint tradeId) payable public returns(bool){
        uint price = tradePrice[tradeId];
        require(msg.value >= price,"price less than expected");
        require(tradeStatus[tradeId][msg.sender] == true , "Trade is not accepted or authorized");
        require(block.timestamp <= tradeDeadline[tradeId],"Trade window Expired");
        address payable sender = senderAddress[tradeId];
        uint[] memory tokenId1 = tradeTokenId1[tradeId];
        uint[] memory tokenId2 = tradeTokenId2[tradeId];
        address[] memory contractAddress1 = tradeNft1[tradeId]; 
        address[] memory contractAddress2 = tradeNft2[tradeId]; 
        trade(msg.sender,sender,tokenId2,contractAddress2);
        trade(sender,msg.sender,tokenId1,contractAddress1);
        if (msg.value > price){
            uint additionalprice = SafeMath.sub(msg.value,price);
            tipAddress.transfer(additionalprice);
        }
        IWETH9(WETH).transferFrom(msg.sender,tipAddress,platformTip);
        IWETH9(WETH).transferFrom(sender,tipAddress,platformTip);
        sender.transfer(price);
        return true;
    }

    function trade(address user1,address user2,uint[] memory tokenId,address[] memory contractAddress) private {
        for(uint i=0;i<contractAddress.length;i++){
            IERC721 token =  IERC721(contractAddress[i]);
            for(uint j=0;j<tokenId.length;j++){
                bool tokenExist = token.isExist(tokenId[j]);
                if(tokenExist == true){
                address ownerOf = token.ownerOf(tokenId[j]);
                if(ownerOf == user1){
                    address approval = token.getApproved(tokenId[j]);
                    if(approval == address(this)){
                        token.transferFrom(user1,address(this),tokenId[j]);
                        token.transferFrom(address(this),user2,tokenId[j]);
                    }
                }
            }
            }
        }
    }
    }

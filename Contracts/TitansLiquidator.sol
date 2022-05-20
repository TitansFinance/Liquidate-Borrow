
pragma solidity >=0.6.0<0.8.0;

import './DAI.sol';
import './CTokenInterface.sol';
import './ComptrollerInterface.sol';

contract TitansLiquidator {
  
  DAI public underlyingTokenBorrow;
  CTokenInterface public cTokenBorrow;
  ComptrollerInterface public comptroller;
  address public owner;
  uint public ethBalance;

  modifier onlyOwner {
    require(msg.sender == owner, "You are not the owner");
    _;
  }

   event TransferReceived(address _from, uint _amount);
   event TransferSend(address _source,address _destination,uint _amount);

  constructor(address _comptroller, address _underlyingTokenBorrow, address _cTokenBorrow, address _owner) public {
    underlyingTokenBorrow = DAI(_underlyingTokenBorrow);
    cTokenBorrow = CTokenInterface(_cTokenBorrow);
    comptroller = ComptrollerInterface(_comptroller);
    owner = _owner;
  }

  receive() payable external {
    ethBalance +=msg.value;
    emit TransferReceived(msg.sender,msg.value);
  }

// liquidate borrow 
  function liquidate( address _borrower, uint _repayAmount, CTokenInterface _cTokenCollateral) external returns (bool) {
    underlyingTokenBorrow.transferFrom(msg.sender, address(this), _repayAmount);
    underlyingTokenBorrow.approve(address(cTokenBorrow), _repayAmount);
    require( cTokenBorrow.liquidateBorrow(_borrower, _repayAmount, _cTokenCollateral) == 0,"liquidate failed");
    uint balance = CTokenInterface(_cTokenCollateral).balanceOf(address(this));
    CTokenInterface(_cTokenCollateral).redeem(balance);
    emit TransferReceived(address(this),balance);
   return true; 
  }

  // get the cToken balance of the contract 
  function getCTokenBalance(address _cTokenCollateral) external view returns (uint) {
    return CTokenInterface(_cTokenCollateral).balanceOf(address(this));
  }

// get the underlying Token balance of the contract 
  function getUnderlyingTokenBalance(address _underlyingTokenCollatoral) external view returns (uint){
      return DAI(_underlyingTokenCollatoral).balanceOf(address(this));
  }

  // withdraw Eth from contract to EOA 

  function withdrawEth(address payable _receiver) onlyOwner external returns(bool){
    uint amount = address(this).balance;
    _receiver.transfer(amount);
    ethBalance -= amount;
    emit TransferSend(address(this),_receiver,amount);
  }
  
 // Withdraw the tokens from the contract to EOA  
function withdrawTokens (address _receiver, address _underlyingToken) onlyOwner external returns (bool){
  uint amount = DAI(_underlyingToken).balanceOf(address(this));
  DAI(_underlyingToken).transfer(_receiver,amount);
  emit TransferSend(address(this),_receiver,amount);
  return true ;
}

  // get amount of collateral to be liquidated
  function getAmountToBeLiquidated(
    address _cTokenBorrowed,
    address _cTokenCollateral,
    uint _actualRepayAmount
  ) external view returns (uint) {
    /*
     * Get the exchange rate and calculate the number of collateral tokens to seize:
     *  seizeAmount = actualRepayAmount * liquidationIncentive * priceBorrowed / priceCollateral
     *  seizeTokens = seizeAmount / exchangeRate
     *   = actualRepayAmount * (liquidationIncentive * priceBorrowed) / (priceCollateral * exchangeRate)
     */
    (uint error, uint cTokenCollateralAmount) = comptroller
    .liquidateCalculateSeizeTokens(
      _cTokenBorrowed,
      _cTokenCollateral,
      _actualRepayAmount
    );

    require(error == 0, "error");

    return cTokenCollateralAmount;
  }

  
}
pragma solidity ^0.6.0;

abstract contract CTokenInterface {
  function mint(uint mintAmount) external virtual  returns (uint);
  function redeem(uint redeemTokens) external virtual  returns (uint);
  function redeemUnderlying(uint redeemAmount) virtual  external returns (uint);
  function borrow(uint borrowAmount) external virtual returns (uint);
  function repayBorrow(uint repayAmount) external virtual returns (uint);
  function repayBorrowBehalf(address borrower, uint repayAmount) external virtual returns (uint);
  function liquidateBorrow(address borrower, uint repayAmount, CTokenInterface cTokenCollateral) external virtual returns (uint);

 function transfer(address dst, uint amount) external virtual  returns (bool);
 function transferFrom(address src, address dst, uint amount) external  virtual returns (bool);
 function approve(address spender, uint amount) external virtual  returns (bool);
 function allowance(address owner, address spender) external virtual view returns (uint);
 function balanceOf(address owner) external view virtual returns (uint);
 function balanceOfUnderlying(address owner) external virtual  returns (uint);
}
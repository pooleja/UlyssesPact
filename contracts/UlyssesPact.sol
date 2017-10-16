pragma solidity ^0.4.15;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

/**
 * @title UlyssesPact
 * @dev Locks your shit up so you can't sell it.
 */
contract UlyssesPact is Ownable {

  // Time when contract will allow withdraws
  uint256 public unlockTime;

  // Constructor to set the unlock time
  function UlyssesPact(uint256 _unlockTime) {
    unlockTime = _unlockTime;
  }

  // Fallback function to allow ETH to be sent in
  function() payable { }

  // Call to withdraw ETH or tokens that implement ERC20 token interface
  function claim() onlyOwner {

    // Don't allow anything to be withdrawn until the unlock time
    require(block.timestamp > unlockTime);

    // Withdraw the ETH    
    owner.transfer(this.balance);
  }
}
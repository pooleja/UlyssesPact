pragma solidity ^0.4.15;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import 'zeppelin-solidity/contracts/token/StandardToken.sol';

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

  // Call to withdraw ETH
  function withdrawEth() onlyOwner {

    // Don't allow anything to be withdrawn until the unlock time
    require(block.timestamp > unlockTime);

    // Withdraw the ETH    
    owner.transfer(this.balance);
  }

  // Call to withdraw ERC20 Tokens
  function withdrawTokens(address _token) onlyOwner {

    // Don't allow anything to be withdrawn until the unlock time
    require(block.timestamp > unlockTime);

    // Withdraw the tokens
    StandardToken token = StandardToken(_token);
    uint balance = token.balanceOf(this);
    token.transfer(owner, balance);
  }
}
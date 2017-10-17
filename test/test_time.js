/* global web3, artifacts, it, assert, contract */
var UlyssesPact = artifacts.require('./UlyssesPact.sol')
var timeHelper = require('./helpers/fastForwardTime')
var assertJump = require('./helpers/assertJump')

contract('Ulysses Pact', async (accounts) => {
  it('should deploy with correct value', async () => {
    let unlockTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 100
    let contractInst = await UlyssesPact.new(unlockTime)

    console.log(contractInst.address)

    let setTime = await contractInst.unlockTime()
    assert.equal(setTime.toNumber(), unlockTime, 'Contract unlock time should be initialized')
  })

  it('should allow withdraw of ETH after time passes', async () => {
    // Get the unlock time 100 seconds into the future from now
    let unlockTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 100

    // Create the contract with the unlock time
    let contractInst = await UlyssesPact.new(unlockTime)

    // Send some ETH into the contract
    await web3.eth.sendTransaction({from: accounts[0], to: contractInst.address, value: 200000})

    // Should fail before time
    try {
      await contractInst.withdrawEth()
      assert.fail('Before the unlock time should fail')
    } catch (error) {
      assertJump(error)
    }

    // Fast forward 100 seconds
    await timeHelper.fastForward(101)

    // Withdraw should succeed
    await contractInst.withdrawEth()
  })

  it('should not allow withdraw of ETH from another account', async () => {
    let unlockTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 100
    let contractInst = await UlyssesPact.new(unlockTime)

    // Send some ETH into the contract
    await web3.eth.sendTransaction({from: accounts[0], to: contractInst.address, value: 200000})

    // Fast forward 100 blocks
    await timeHelper.fastForward(101)

    // Withdraw from account[2], which is not the owner should fail
    try {
      await contractInst.withdrawEth({from: accounts[2]})
      assert.fail('Non owner withdraw should fail')
    } catch (error) {
      assertJump(error)
    }
  })
})

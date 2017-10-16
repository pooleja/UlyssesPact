/* global artifacts */
var UlyssesPact = artifacts.require('./UlyssesPact.sol')

module.exports = function (deployer, network, accounts) {
  deployer.deploy(UlyssesPact, 1513209600) // Don't allow withdraws until my birthday
}

const TargetContract = artifacts.require('TargetContract')
const NoFeePaymaster = artifacts.require('NoFeePaymaster')
const TokenFeePaymaster = artifacts.require('TokenFeePaymaster')
const RelayHub = artifacts.require('RelayHub')
const Token = artifacts.require('Token')
const TokenBank = artifacts.require('TokenBank')


module.exports = async function (deployer) {

  const forwarder = require( '../build/gsn/Forwarder' ).address
  
  await deployer.deploy(TargetContract, forwarder)

  


	await deployer.deploy(Token)
	const token = await Token.deployed()
  

  await deployer.deploy(TokenBank,token.address)
	const tokenBank = await TokenBank.deployed()

  token.mint(tokenBank.address)
  token.passMinterRole(tokenBank.address)
  
  


  const relayHubAddress = require('../build/gsn/RelayHub.json').address

  await deployer.deploy(NoFeePaymaster)
  const noFeepaymaster = await NoFeePaymaster.deployed()
  await noFeepaymaster.setRelayHub(relayHubAddress)
  await noFeepaymaster.setTrustedForwarder(forwarder) // only trusted forwarder atm
  await noFeepaymaster.setTokenBank(token.address)


  await deployer.deploy(TokenFeePaymaster)
  const tokenFeepaymaster = await TokenFeePaymaster.deployed()
  await tokenFeepaymaster.setRelayHub(relayHubAddress)
  await tokenFeepaymaster.setTrustedForwarder(forwarder) // only trusted forwarder atm
  await tokenFeepaymaster.setTokenBank(token.address)


  console.log(`RelayHub(${relayHubAddress}) set on Paymaster(${noFeepaymaster.address})`)
  const relayHub = await RelayHub.at(relayHubAddress)
  await relayHub.depositFor(noFeepaymaster.address, {value: 1e18.toString()})
  console.log(`1 ETH deposited to Paymaster(${noFeepaymaster.address})`)

  
  console.log(`RelayHub(${relayHubAddress}) set on Paymaster(${tokenFeepaymaster.address})`)
  await relayHub.depositFor(tokenFeepaymaster.address, {value: 1e18.toString()})
  console.log(`1 ETH deposited to Paymaster(${tokenFeepaymaster.address})`)
}

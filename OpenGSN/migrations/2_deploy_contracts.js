const CaptureTheFlag = artifacts.require('CaptureTheFlag')
const CustomPaymaster = artifacts.require('CustomPaymaster')
const RelayHub = artifacts.require('RelayHub')
const Token = artifacts.require('Token')
const TokenBank = artifacts.require('TokenBank')


module.exports = async function (deployer) {
  const forwarder = require( '../build/gsn/Forwarder' ).address
  
  await deployer.deploy(CaptureTheFlag, forwarder)

  


	await deployer.deploy(Token)
	const token = await Token.deployed()
  

  await deployer.deploy(TokenBank,token.address,100)
	const tokenBank = await TokenBank.deployed()



  const relayHubAddress = require('../build/gsn/RelayHub.json').address

  await deployer.deploy(CustomPaymaster)
  const paymaster = await CustomPaymaster.deployed()
  await paymaster.setRelayHub(relayHubAddress)
  await paymaster.setTrustedForwarder(forwarder) // only trusted forwarder atm
  await paymaster.setTokenBank(tokenBank.address)
  // await paymaster.whitelistSender('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1')
  

  // to add more addresses to the whitelist, open truffle console and run:
  // const pm = await WhitelistPaymaster.deployed()
  // pm.whitelistSender('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1')

  console.log(`RelayHub(${relayHubAddress}) set on Paymaster(${paymaster.address})`)
  const relayHub = await RelayHub.at(relayHubAddress)
  await relayHub.depositFor(paymaster.address, {value: 1e18.toString()})
  console.log(`1 ETH deposited to Paymaster(${paymaster.address})`)
}

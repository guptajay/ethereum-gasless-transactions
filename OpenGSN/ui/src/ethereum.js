const ethers = require('ethers')
const { formatEther } = require('ethers/lib/utils')
const { RelayProvider } = require('@opengsn/provider')


const contractArtifact = require('../../build/contracts/TargetContract.json')

const noFeePaymasterArtifact = require('../../build/contracts/NoFeePaymaster.json')
const tokenFeePaymasterArtifact = require('../../build/contracts/TokenFeePaymaster.json')

const tokenBankArtifact = require('../../build/contracts/TokenBank.json')

let targetContractNoFeePaymaster
let targetContractTokenFeePaymaster
let noFeePaymasterContract
let tokenFeePaymasterContract
let tokenBankContract

let contractAddress

let artifactNetwork
let networkId
let TokenFeeprovider
let NoFeeprovider

async function getAllAddresses() {

    if (!window.ethereum) {
        throw new Error('provider not found')
    }
    window.ethereum.on('accountsChanged', () => {
        console.log('acct');
        window.location.reload()
    })
    window.ethereum.on('chainChanged', () => {
        console.log('chainChained');
        window.location.reload()
    })

    networkId = await window.ethereum.request({ method: 'net_version' })


    let noFeePaymasterAddr = noFeePaymasterArtifact.networks[networkId].address
    let feePaymasterAddr = tokenFeePaymasterArtifact.networks[networkId].address
    let recepientAddr = contractArtifact.networks[networkId].address
    return [noFeePaymasterAddr, feePaymasterAddr, recepientAddr]
}

async function initNoFeePaymaster() {

    if (!window.ethereum) {
        throw new Error('provider not found')
    }
    window.ethereum.on('accountsChanged', () => {
        console.log('acct');
        window.location.reload()
    })
    window.ethereum.on('chainChanged', () => {
        console.log('chainChained');
        window.location.reload()
    })

    networkId = await window.ethereum.request({ method: 'net_version' })

    const gsnProviderNoFeePaymaster = await RelayProvider.newProvider({
        provider: window.ethereum,
        config: {
            paymasterAddress: noFeePaymasterArtifact.networks[networkId].address
        }
    }).init()


    NoFeeprovider = new ethers.providers.Web3Provider(gsnProviderNoFeePaymaster)

    const noFeeNetwork = await NoFeeprovider.getNetwork()
    artifactNetwork = contractArtifact.networks[networkId]


    if (!artifactNetwork)
        throw new Error('Can\'t find deployment on network ' + networkId)

    contractAddress = artifactNetwork.address


    targetContractNoFeePaymaster = new ethers.Contract(
        contractAddress, contractArtifact.abi, NoFeeprovider.getSigner())

    noFeePaymasterContract = new ethers.Contract(
        noFeePaymasterArtifact.networks[networkId].address, noFeePaymasterArtifact.abi, NoFeeprovider.getSigner())



    await listenToNoFeeEvents()
    return { contractAddress, noFeeNetwork }
}

async function initTokenFeePaymaster() {

    if (!window.ethereum) {
        throw new Error('provider not found')
    }
    window.ethereum.on('accountsChanged', () => {
        console.log('acct');
        window.location.reload()
    })
    window.ethereum.on('chainChanged', () => {
        console.log('chainChained');
        window.location.reload()
    })

    networkId = await window.ethereum.request({ method: 'net_version' })

    const gsnProviderTokenFeePaymaster = await RelayProvider.newProvider({
        provider: window.ethereum,
        config: {
            paymasterAddress: tokenFeePaymasterArtifact.networks[networkId].address
        }
    }).init()


    TokenFeeprovider = new ethers.providers.Web3Provider(gsnProviderTokenFeePaymaster)

    const TokenFeeNetwork = await TokenFeeprovider.getNetwork()
    artifactNetwork = contractArtifact.networks[networkId]


    if (!artifactNetwork)
        throw new Error('Can\'t find deployment on network ' + networkId)

    contractAddress = artifactNetwork.address


    targetContractTokenFeePaymaster = new ethers.Contract(
        contractAddress, contractArtifact.abi, TokenFeeprovider.getSigner())


    tokenFeePaymasterContract = new ethers.Contract(
        tokenFeePaymasterArtifact.networks[networkId].address, tokenFeePaymasterArtifact.abi, TokenFeeprovider.getSigner())

    await listenToTokenFeeEvents()
    return { contractAddress, TokenFeeNetwork }
}


async function noFeeContractCall() {
    await window.ethereum.send('eth_requestAccounts')

    let transaction = await targetContractNoFeePaymaster.noCommissionTx()
    let hash = transaction.hash
    console.log(`Transaction ${hash} sent`)
    let receipt = await NoFeeprovider.waitForTransaction(hash)
    console.log(`Mined in block: ${receipt.blockNumber}`)

}


async function tokenFeeContractCall() {

    await window.ethereum.send('eth_requestAccounts')

    let transaction = await targetContractTokenFeePaymaster.tokenCommissionTx()
    let hash = transaction.hash
    console.log(`Transaction ${hash} sent`)
    let receipt = await TokenFeeprovider.waitForTransaction(hash)
    console.log(`Mined in block: ${receipt.blockNumber}`)


}


// let logview

// function log(message) {
//     message = message.replace(/(0x\w\w\w\w)\w*(\w\w\w\w)\b/g, '<b>$1...$2</b>')
//     if (!logview) {
//         logview = document.getElementById('logview')
//     }
//     logview.innerHTML = message + "<br>\n" + logview.innerHTML
// }


// async function listenToEvents() {

//   targetContractNoFeePaymaster.on('NoFeeFlagCaptured', (previousHolder, currentHolder, rawEvent) => {
//     log(`No FEE Flag Captured from&nbsp;${previousHolder} by&nbsp;${currentHolder}`)
//     console.log(`NO FEE Flag Captured from ${previousHolder} by ${currentHolder}`)
//   })


//   targetContractTokenFeePaymaster.on('TokenFeeFlagCaptured', (previousHolder, currentHolder, rawEvent) => {
//     log(`Token Fee Flag Captured from&nbsp;${previousHolder} by&nbsp;${currentHolder}`)
//     console.log(`TOKEN FEE Flag Captured from ${previousHolder} by ${currentHolder}`)
//   })

// }



async function listenToNoFeeEvents() {
    targetContractNoFeePaymaster.on('NoFeeFlagCaptured', (previousHolder, currentHolder, rawEvent) => {
        console.log(`No Fee Flag Captured from ${previousHolder} by ${currentHolder}`)
    })
}

async function listenToTokenFeeEvents() {
    targetContractTokenFeePaymaster.on('TokenFeeFlagCaptured', (previousHolder, currentHolder, rawEvent) => {
        console.log(`Token Fee Flag Captured from ${previousHolder} by ${currentHolder}`)
    })
}




window.app = {
    initNoFeePaymaster,
    initTokenFeePaymaster,
    noFeeContractCall,
    tokenFeeContractCall,
    getAllAddresses,
    noFeeContractCall,
    tokenFeeContractCall
}
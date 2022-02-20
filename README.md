# Ethereum Gasless Transactions
> CZ4153 Blockchain Technology  
> School of Computer Science & Engineering  
> Nanyang Technological University, Singapore  


## Introduction

Public blockchain networks are open access, therefore, anyone can join the network while remaining anonymous. Anyone who sends an Ethereum transaction must have Ether (ETH) to pay for its gas fees. This forces new users to purchase Ether (which can be a daunting task due to compliance and regulatory requirements such as KYC processes and other transaction/processing fees) before they can start using a decentralized application. 

In this project, we have designed a decentralized Ethereum-based blockchain application where the user does not need to pay for any gas fees while performing a transaction. The gas fees are managed and paid by another entity `paymaster`. 

A simple use case can be of a vendor switching to Ethereum-based smart contract network to accept transactions using its own token currency. In this scenario, user onboarding and payments by the customers will be a hurdle if they need to firstly buy ether, and then, pay a gas fee for every purchase. Therefore, our prototype can be utilized to allow the vendor to cover any transaction charges on behalf of its customers.


## Strategy

Our approach builds on top of the sample implementation provided by the `OpenGSN` team. In the original version, a whitelist paymaster is used which essentially accepts all transactions from the sender. In our application, we introduce two token paymaster contracts which take an `ERC20` token from the sender and transfer it to a recipient contract. One of the paymasters charges a token fee to the user as a substitute for the transaction fee and the other subsides the transaction fee by making a zero-fee transaction, where the latter case presents a case for customer onboarding.

## Deployment & Testing
> **Warning:** Do not reinstall the node modules (except those in 5.6.1) as the it throws compatibility errors. All other node modules are packaged with the code. Refer to `truffleConsoleCmds.txt` for additional testing commands

1. Open command prompt/terminal and navigate to `OpenGSN` folder.
2. Execute the command `yarn ganache`. 
3. In a separate terminal window execute `npx gsn start` (to initialize the gas station network).
4. In a separate terminal window execute `rm -rf build/contracts` (clear cache).
5. In the same terminal as `4`, execute `yarn start`
6. After the deployed are completed in `5`, in another terminal window navigate to `OpenGSN/ui` folder and execute command `npm start`. Install relevant node/npm dependencies if prompted to do so in `6`.
7. The application should be deployed at `localhost:3000`.
8. Open Metamask and import any private key from ganache. In our experiments, we used the following key: `0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d`.

## dApp
<img src="https://user-images.githubusercontent.com/43084501/154837762-6a881c5e-f497-45bf-9a0a-5fd278e43b5d.png">

## Authors
* [Numair Fazili](https://github.com/NumairFazili)
* [Jay Gupta](https://github.com/guptajay)
* [Ritwik Kanodia](https://github.com/ritwikkanodia)

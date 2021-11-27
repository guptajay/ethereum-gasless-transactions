# ethereum-gasless-transactions
Project on Ethereum Gasless Transactions for CZ4153 Blockchain Technology (OPENGSN)


5.1 Open command prompt / terminal and navigate to OpenGSN folder 

5.2 Execute the command yarn ganache  

5.3 In a separate terminal window execute npx gsn start (to initialize the gas station network) 

5.4 In a separate terminal window execute rm -rf build/contracts (clear cache) 

5.5 In the same terminal as 5.4 execute yarn start 

5.6 After the deployed are completed in 5.5, in another terminal window navigate to OpenGSN/ui folder and execute command npm start 

5.6.1 Install relevant node/npm modules if prompted to do so in 5.6 

5.7 The application should be deployed at localhost:3000 

5.8 Open Metamask and import any private key from ganache. In our experiments, we used the following key: 0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d 


Refer to truffleConsoleCmds.txt for additional testing commands


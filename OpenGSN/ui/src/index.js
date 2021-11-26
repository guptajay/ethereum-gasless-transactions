import React from 'react';
import ReactDOM from 'react-dom';
import './ethereum.js'
import './index.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './bundle.js'
import { Component } from 'react'
import { Card, CardGroup, Navbar, Nav, Container, Button, ListGroup, Badge, InputGroup, FormControl, DropdownButton, Dropdown, Spinner } from 'react-bootstrap'
import { FaUserTie, FaUserSecret } from "react-icons/fa"
import { SiEthereum } from "react-icons/si"
import Web3 from 'web3';

import relayHubJson from '../../build/contracts/RelayHub.json';
import relayHubAddressJson from '../../build/gsn/RelayHub.json';
import noFeePaymasterAddressJson from '../../build/contracts/NoFeePaymaster.json';
import tokenJson from '../../build/contracts/Token.json';
import tokenBankJson from '../../build/contracts/TokenBank.json';


class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {

    //check if MetaMask exists

    //assign to values to variables: web3, netId, accounts

    //check if account is detected, then load balance&setStates, elsepush alert

    //in try block load contracts

    //if MetaMask not exists push alert
  }

  async deposit(amount) {
    //check if this.state.dbank is ok
    //in try block call dBank deposit();
  }

  async withdraw(e) {
    //prevent button from default click
    //check if this.state.dbank is ok
    //in try block call dBank withdraw();
  }

  // getUserETH() {
  //     //var balance = await web3.eth.getBalance(walletAddress); //Will give value in.
  //     //balance = await web3.toDecimal(balance);
  // }

  // getUserTokens() {

  // }

  freePayMaster() {
    console.log('freePayMaster')
    window.app.initNoFeePaymaster().then(function ({ contractAddress, network }) {
      // console.log('CaptureTheFlag contract', contractAddress)
      // console.log(`identified network: ${JSON.stringify(network)}`)
    window.app.noFeeContractCall()

    })
  }

  paidPayMaster() {
    console.log('paidPayMaster')
    window.app.initTokenFeePaymaster().then(function ({ contractAddress, network }) {
      // console.log('CaptureTheFlag contract', contractAddress)
      // console.log(`identified network: ${JSON.stringify(network)}`)
      window.app.tokenFeeContractCall()
    })
  }

  async buyUserTokens() {
    console.log('user tokens')
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const netId = await window.ethereum.request({ method: 'net_version' })

    web3.eth.getAccounts().then(async (accounts) => {
      const tokenBankAddress = await tokenBankJson.networks[netId].address;
      const tokenBankContract = await new web3.eth.Contract(tokenBankJson.abi, tokenBankAddress)

      var buyTokens = await tokenBankContract.methods.buyTokens().send({from:accounts[0],value:20*10**18})
      console.log("Bought tokens successfully")
    })
  }

  async changeAllowanceFreePaymaster() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const netId = await window.ethereum.request({ method: 'net_version' })
    console.log('Netid', netId)

    const tokenAddress = await tokenJson.networks[netId].address
    const tokenContract = new web3.eth.Contract(tokenJson.abi, tokenAddress);
    web3.eth.getAccounts().then(async (accounts) => {
      window.app.getAllAddresses().then(async (addr) => {
        const increasedAllowance = await tokenContract.methods.increaseAllowance(addr[0], 5).send({from:accounts[0]});
        console.log("Free Paymaster Allowance Increased")
      })
  })
  }

  async changeAllowancePaidPaymaster() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const netId = await window.ethereum.request({ method: 'net_version' })
    console.log('Netid', netId)

    const tokenAddress = await tokenJson.networks[netId].address
    const tokenContract = new web3.eth.Contract(tokenJson.abi, tokenAddress);
    web3.eth.getAccounts().then(async (accounts) => {
      window.app.getAllAddresses().then(async (addr) => {
        const increasedAllowance = await tokenContract.methods.increaseAllowance(addr[1], 5).send({from:accounts[0]});
        console.log("Paid Paymaster Allowance Increased")
      })
  })

  }

  async getBalance() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const netId = await window.ethereum.request({ method: 'net_version' })
    console.log('Netid', netId)

    const tokenAddress = await tokenJson.networks[netId].address
    const tokenContract = new web3.eth.Contract(tokenJson.abi, tokenAddress);

    web3.eth.getAccounts().then(async (accounts) => {




      var balanceOfUser = await web3.eth.getBalance(accounts[0]);
      var etherOfUser = web3.utils.fromWei(balanceOfUser, "ether")
      //etherOfUser = parseFloat(etherOfUser).toFixed(4)
      this.setState({ etherOfUser: etherOfUser })
      console.log("User Balance: " + etherOfUser + " ETH")

      // User Token Balance

      const tokenBalance = await tokenContract.methods.balanceOf(accounts[0]).call();
      this.setState({ tokenOfUser: tokenBalance })
      console.log("User Token Balance: " + tokenBalance + " tokens")
    });

    window.app.getAllAddresses().then(async (addr) => {
      console.log("add:", addr[0], addr[1], addr[2])

      // Ether Balances
      // ------------------------------------------------------------)

      const relayHubAddress = await relayHubAddressJson.address
      console.log('relayHub address', relayHubAddress)

      const RelayHub = await new web3.eth.Contract(relayHubJson.abi, relayHubAddress)

      const nofeePmAddr = noFeePaymasterAddressJson.networks[netId].address
      let noFeePmBal = await RelayHub.methods.balanceOf(nofeePmAddr).call()
      console.log('No Fee Paymaster Balance: ', web3.utils.fromWei(noFeePmBal.toString()))

      var balanceOfNoFeePaymaster = await RelayHub.methods.balanceOf(addr[0]).call();
      var etherOfNoFeePaymaster = web3.utils.fromWei(balanceOfNoFeePaymaster.toString(), "ether")
      this.setState({ etherOfNoFeePaymaster: etherOfNoFeePaymaster })
      console.log("No Fee Paymaster Balance: " + etherOfNoFeePaymaster + " ETH")

      var balanceOfFeePaymaster = await RelayHub.methods.balanceOf(addr[1]).call();
      var etherOfFeePaymaster = web3.utils.fromWei(balanceOfFeePaymaster.toString(), "ether")
      this.setState({ etherOfFeePaymaster: etherOfFeePaymaster })
      console.log("Fee Paymaster Balance: " + etherOfFeePaymaster + " ETH")

      var balanceOfRecepient = await web3.eth.getBalance(addr[2]);
      var etherOfRecepient = web3.utils.fromWei(balanceOfRecepient, "ether")
      this.setState({ etherOfRecepient: etherOfRecepient })
      console.log("Recepient Balance: " + etherOfRecepient + " ETH")
      // ------------------------------------------------------------

      // Token Balances
      // ------------------------------------------------------------
      // const tokenAddress = await tokenJson.address
      // const tokenContract = new web3.eth.Contract(tokenJson.abi, tokenAddress);

      // No Fee Paymaster Token Balance
      const tokenBalanceOfNoFeePaymaster = await tokenContract.methods.balanceOf(addr[0]).call();
      this.setState({ tokenOfNoFeePaymaster: tokenBalanceOfNoFeePaymaster })
      console.log("No Fee Paymaster Token Balance: " + tokenBalanceOfNoFeePaymaster + " tokens")

      // Fee Paymaster Token Balance
      const tokenBalanceOfFeePaymaster = await tokenContract.methods.balanceOf(addr[1]).call();
      this.setState({ tokenOfFeePaymaster: tokenBalanceOfFeePaymaster })
      console.log("No Fee Paymaster Token Balance: " + tokenBalanceOfFeePaymaster + " tokens")

      // Recepient Token Balance
      const tokenBalanceOfRecepient = await tokenContract.methods.balanceOf(addr[2]).call();
      this.setState({ tokenOfRecepient: tokenBalanceOfRecepient })
      console.log("Recepient Token Balance: " + tokenBalanceOfRecepient + " tokens")
      // ------------------------------------------------------------

      // Paymaster Alowances
      // ----
      web3.eth.getAccounts().then(async (accounts) => {
      const tokenAllowanceFreePaymaster = await tokenContract.methods.allowance(accounts[0], addr[0]).call();
      this.setState({ freePaymasterAllowance: tokenAllowanceFreePaymaster })

      const tokenAllowancePaidPaymaster = await tokenContract.methods.allowance(accounts[0], addr[1]).call();
      this.setState({ paidPaymasterAllowance: tokenAllowancePaidPaymaster })

      const tokenBankAddress = await tokenBankJson.networks[netId].address;
      var tokenBankTokenBalance = await tokenContract.methods.balanceOf(tokenBankAddress).call()
      this.setState({ tokenBankTokenBalance: tokenBankTokenBalance })

      var tokenBankEtherBalance =  await web3.eth.getBalance(tokenBankAddress);
      tokenBankEtherBalance = web3.utils.fromWei(tokenBankEtherBalance.toString(), "ether")
      this.setState({ tokenBankEtherBalance: tokenBankEtherBalance })
      })
      // ----

      // recepient is not hosted on RelayHub (get directly)
    })
  }

  async getTokenBalance(walletAddress) {
    //balance = await contract.methods.balanceOf(walletAddress).call();
    //console.log(balance)
  }

  constructor(props) {
    super(props)
    this.state = {
      etherOfUser: 0,
      etherOfNoFeePaymaster: 0,
      etherOfFeePaymaster: 0,
      etherOfRecepient: 0,
      tokenOfUser: 0,
      tokenOfNoFeePaymaster: 0,
      tokenOfFeePaymaster: 0,
      tokenOfRecepient: 0,
      tokenBankEtherBalance: 0,
      tokenBankTokenBalance: 0,
      freePaymasterAllowance: 0,
      paidPaymasterAllowance: 0
    }
    this.getBalance = this.getBalance.bind(this)
    const Web3 = require("web3");

    const ethEnabled = async () => {
      if (window.ethereum) {
        await window.ethereum.send('eth_requestAccounts');
        window.web3 = new Web3(window.ethereum);
        return true;
      }
      return false;
    }

    ethEnabled().then(function (result) {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
      web3.eth.getAccounts().then(function (accounts) {
        console.log(accounts)
      });
    })

  }

  render() {
    return (
      <div className='text-monospace'>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="#home">Option 10: BlueJay Gasless Tokens</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
              </Nav>
              <Nav>
                <Nav.Link>Numair Fazili</Nav.Link>
                <Nav.Link>Jay Gupta</Nav.Link>
                <Nav.Link>Ritwik Kanodia</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className='mt-5'>
          <CardGroup>
            <Card className="text-center">
              <div class="row mt-5">
                <FaUserTie style={{ color: 'brown', fontSize: '100px' }} />
              </div>
              <Card.Body>
                <Card.Title>User</Card.Title>
                <Card.Text>
                  Entity that does not require Ether to execute a transaction on the Ethereum Platform.
                </Card.Text>
                <ListGroup>
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">ETH (Ether)</div>
                    </div>
                    <Badge variant="primary" pill style={{ fontSize: '15px' }}>
                      {this.state.etherOfUser}
                    </Badge>
                  </ListGroup.Item>
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">ERC20 (Tokens)</div>
                    </div>
                    <Badge bg="warning" text="dark" pill style={{ fontSize: '15px' }}>
                      {this.state.tokenOfUser}
                    </Badge>
                  </ListGroup.Item>
                </ListGroup>

                <InputGroup className="mt-4">
                  <FormControl aria-label="Number of Tokens" placeholder="1 Token" disabled />
                  <DropdownButton
                    variant="outline-secondary"
                    title="Choose and Pay"
                    id="typePaymaster">
                    <Dropdown.Item onClick={this.freePayMaster}>Pay with Free Paymaster</Dropdown.Item>
                    <Dropdown.Item onClick={this.paidPayMaster}>Pay with Paid Paymaster</Dropdown.Item>
                  </DropdownButton>
                </InputGroup>
              </Card.Body>

            </Card>
            <Card className="text-center">
              <div class="row mt-5">
                <SiEthereum style={{ color: 'blue', fontSize: '100px' }} />
              </div>
              <Card.Body>
                <Card.Title>Free Paymaster</Card.Title>
                <Card.Text>
                  Paymaster receives the transactions via the relayer and pays the Gas Fee for the transactions.
                </Card.Text>

                <ListGroup>
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">ETH (Ether)</div>
                    </div>
                    <Badge variant="primary" pill style={{ fontSize: '15px' }}>
                      {this.state.etherOfNoFeePaymaster}
                    </Badge>
                  </ListGroup.Item>
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">ERC20 (Tokens)</div>
                    </div>
                    <Badge bg="warning" text="dark" pill style={{ fontSize: '15px' }}>
                      {this.state.tokenOfNoFeePaymaster}
                    </Badge>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
            <Card className="text-center">
              <div class="row mt-5">
                <SiEthereum style={{ color: 'blue', fontSize: '100px' }} />
              </div>
              <Card.Body>
                <Card.Title>Paid Paymaster</Card.Title>
                <Card.Text>
                  Paymaster receives the transactions via the relayer and pays the Gas Fee via the tokens supplied by the user.
                </Card.Text>

                <ListGroup>
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">ETH (Ether)</div>
                    </div>
                    <Badge variant="primary" pill style={{ fontSize: '15px' }}>
                      {this.state.etherOfFeePaymaster}
                    </Badge>
                  </ListGroup.Item>
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">ERC20 (Tokens)</div>
                    </div>
                    <Badge bg="warning" text="dark" pill style={{ fontSize: '15px' }}>
                      {this.state.tokenOfFeePaymaster}
                    </Badge>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
            <Card className="text-center">
              <div class="row mt-5">
                <FaUserSecret style={{ fontSize: '100px' }} />
              </div>
              <Card.Body>
                <Card.Title>Recepient</Card.Title>
                <Card.Text>
                  Entity that receives the transactions that are sent from the user through the relayer.
                </Card.Text>

                <ListGroup>
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">ETH (Ether)</div>
                    </div>
                    <Badge variant="primary" pill style={{ fontSize: '15px' }}>
                      {this.state.etherOfRecepient}
                    </Badge>
                  </ListGroup.Item>
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">ERC20 (Tokens)</div>
                    </div>
                    <Badge bg="warning" text="dark" pill style={{ fontSize: '15px' }}>
                      {this.state.tokenOfRecepient}
                    </Badge>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </CardGroup>
        </Container>

        <Container className='mt-3'>
          <Card style={{ width: '40%' }}>
            <Card.Header>Token Bank</Card.Header>
            <Card.Body>
              <Card.Title>Buy Tokens Here</Card.Title>
              <InputGroup className="mt-4">
                <FormControl aria-label="Buy for" placeholder="100 Tokens"
                  disabled />
                <DropdownButton
                  variant="outline-secondary"
                  title="Buy for"
                  id="input-group-dropdown-3"
                >
                  <Dropdown.Item onClick={this.buyUserTokens}>User</Dropdown.Item>
                </DropdownButton>
              </InputGroup>
            </Card.Body>
          </Card>

          <Card style={{ width: '40%' }}>
            <Card.Header>Allowance Manager</Card.Header>
            <Card.Body>
              <Card.Title>Increase Paymaster Allowance Here</Card.Title>
              <InputGroup className="mt-4">
                <FormControl aria-label="" placeholder="5 tokens"
                  disabled />
                <DropdownButton
                  variant="outline-secondary"
                  title="Increase allowance for"
                  id="input-group-dropdown-3"
                >
                  <Dropdown.Item onClick={this.changeAllowanceFreePaymaster}>Free Paymaster</Dropdown.Item>
                  <Dropdown.Item onClick={this.changeAllowancePaidPaymaster}>Paid Paymaster</Dropdown.Item>
                </DropdownButton>
              </InputGroup>

              <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">Token Bank Token Balance</div>
                    </div>
                    <Badge bg="warning" text="dark" pill style={{ fontSize: '15px' }}>
                      {this.state.tokenBankTokenBalance}
                    </Badge>
              </ListGroup.Item>

              <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">Token Bank Ether Balance</div>
                    </div>
                    <Badge bg="warning" text="dark" pill style={{ fontSize: '15px' }}>
                      {this.state.tokenBankEtherBalance}
                    </Badge>
              </ListGroup.Item>

              <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">Free Paymaster Allowance</div>
                    </div>
                    <Badge bg="warning" text="dark" pill style={{ fontSize: '15px' }}>
                      {this.state.freePaymasterAllowance}
                    </Badge>
              </ListGroup.Item>

              <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">Paid Paymaster Allowance</div>
                    </div>
                    <Badge bg="warning" text="dark" pill style={{ fontSize: '15px' }}>
                      {this.state.paidPaymasterAllowance}
                    </Badge>
              </ListGroup.Item>


            </Card.Body>
          </Card>
        </Container>

        <Container className='mt-3'>
          <Card style={{ width: '40%' }}>
            <Card.Body>
              <Button as="input" value="Refresh" onClick={this.getBalance} />
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }
}

export default App;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
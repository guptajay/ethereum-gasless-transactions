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

  getUserETH() {
    //var balance = await web3.eth.getBalance(walletAddress); //Will give value in.
    //balance = await web3.toDecimal(balance);
  }

  getUserTokens() {

  }

  freePayMaster() {
    console.log('freePayMaster')
    window.app.initNoFeePaymaster().then(function ({ contractAddress, network }) {
      console.log('CaptureTheFlag contract', contractAddress)
      console.log(`identified network: ${JSON.stringify(network)}`)
    })
  }

  paidPayMaster() {
    console.log('paidPayMaster')
    window.app.initTokenFeePaymaster().then(function ({ contractAddress, network }) {
      console.log('CaptureTheFlag contract', contractAddress)
      console.log(`identified network: ${JSON.stringify(network)}`)
    })
  }

  buyUserTokens() {
    console.log('user tokens')
  }

  buyPaymasterTokens() {
    console.log('paymaster Tokens')
  }

  buyRecepientTokens() {
    console.log('Recepient Tokens')
  }


  async getBalance() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    web3.eth.getAccounts().then(async function (accounts) {
      var balance = await web3.eth.getBalance(accounts[0]);
      var balanceOfUser = await web3.eth.getBalance(accounts[0]);
      var balanceOfRecepient = await web3.eth.getBalance(accounts[0]);
      var balanceOfPaymaster = await web3.eth.getBalance(accounts[0]);
      var result = web3.utils.fromWei(balance, "ether")
      console.log(result + " ETH")
      return result
    });
  }

  async getTokenBalance(walletAddress) {
    //balance = await contract.methods.balanceOf(walletAddress).call();
    //console.log(balance)
  }

  constructor(props) {
    super(props)
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

        window.app.getAllAddresses().then(function (addresses) {
          console.log(addresses)
        })
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
                      14
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
                      8
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
                <Card.Title>Paymaster</Card.Title>
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
                      14
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
                      8
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
                  Entity that receives the transactions that are sent from the user.
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
                      14
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
                      8
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
                <FormControl aria-label="Buy for" placeholder="10 Tokens"
                  disabled />
                <DropdownButton
                  variant="outline-secondary"
                  title="Buy for"
                  id="input-group-dropdown-3"
                >
                  <Dropdown.Item onClick={this.buyUserTokens}>User</Dropdown.Item>
                  <Dropdown.Item onClick={this.buyPaymasterTokens}>Paymaster</Dropdown.Item>
                  <Dropdown.Item onClick={this.buyRecepientTokens}>Recepient</Dropdown.Item>
                </DropdownButton>
              </InputGroup>
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
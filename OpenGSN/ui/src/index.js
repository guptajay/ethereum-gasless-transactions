import React from 'react';
import ReactDOM from 'react-dom';
import './ethereum.js'
import './index.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Component } from 'react'
import { Card, CardGroup, Navbar, Nav, Container, Button, ListGroup, Badge, InputGroup, FormControl, DropdownButton, Dropdown } from 'react-bootstrap'
import { FaUserTie, FaUserSecret } from "react-icons/fa"
import { SiEthereum } from "react-icons/si"

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
    var balance = await web3.eth.getBalance(walletAddress); //Will give value in.
    balance = await web3.toDecimal(balance);
  }

  getUserTokens() {

  }

  callPaymaster() {
    if(document.getElementById('typePaymaster') == 'Free Paymaster') {
      window.app.initNoFeePaymaster().then(function ({ contractAddress, network }) {
        console.log("ok")
        console.log('CaptureTheFlag contract', contractAddress)
        console.log(`identified network: ${JSON.stringify(network)}`)
      })
    } else {
      window.app.initTokenFeePaymaster().then(function ({ contractAddress, network }) {
        console.log('CaptureTheFlag contract', contractAddress)
        console.log(`identified network: ${JSON.stringify(network)}`)
      })  
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      dbank: null,
      balance: 0,
      dBankAddress: null
    }
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
                  <DropdownButton
                    variant="outline-secondary"
                    title="Choose Paymaster"
                    id="typePaymaster"
                    valye="Free Paymaster">
                    <Dropdown.Item href="#">Free Paymaster</Dropdown.Item>
                    <Dropdown.Item href="#">Paid Paymaster</Dropdown.Item>
                  </DropdownButton>
                  <FormControl aria-label="Number of Tokens" value="1 Token"/>
                  <Button variant="secondary" id="noFeePaymaster" onClick={this.callPaymaster}> 
                    Pay
                  </Button>
                </InputGroup>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">Last updated 3 mins ago</small>
              </Card.Footer>
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
              <Card.Footer>
                <small className="text-muted">Last updated 3 mins ago</small>
              </Card.Footer>
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
              <Card.Footer>
                <small className="text-muted">Last updated 3 mins ago</small>
              </Card.Footer>
            </Card>
          </CardGroup>
        </Container>

        <Container className='mt-3'>
          <Card style={{ width: '40%' }}>
            <Card.Header>Token Bank</Card.Header>
            <Card.Body>
              <Card.Title>Buy Tokens Here</Card.Title>
              <InputGroup className="mt-4">
                <DropdownButton
                  variant="outline-secondary"
                  title="Buy for"
                  id="input-group-dropdown-3">
                  <Dropdown.Item href="#">User</Dropdown.Item>
                  <Dropdown.Item href="#">Paymaster</Dropdown.Item>
                  <Dropdown.Item href="#">Recepient</Dropdown.Item>
                </DropdownButton>
                <FormControl aria-label="Buy for" />
                <Button variant="secondary" id="button-addon2">
                  Buy Tokens
                </Button>
              </InputGroup>
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
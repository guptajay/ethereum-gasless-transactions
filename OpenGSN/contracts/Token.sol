pragma solidity ^0.7.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {

    address public owner;
    event MinterChanged(address indexed from, address to);
    mapping(address => uint) public tokenBalance;


    constructor() public payable ERC20("Token Bank Currency", "TBC") {
    //  _mint(msg.sender,1000*10**18);
    owner = msg.sender;
    
    }


  function passMinterRole(address tokenBank) public returns (bool) {
  	require(msg.sender == owner, 'Error, only owner can change pass minter role');
  	owner = tokenBank;

    emit MinterChanged(msg.sender, tokenBank);
    return true;
  }

  function mint(address account) public {
		require(msg.sender==owner, 'Error, msg.sender does not have minter role'); //dBank
		_mint(account, 1000);
	}





}
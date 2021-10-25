pragma solidity ^0.7.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {

    address public minter;
    event MinterChanged(address indexed from, address to);
    mapping(address => uint) public tokenBalance;


    constructor() public payable ERC20("Decentralized Bank Currency", "DBC") {
        minter = msg.sender; //only initially
    
    }

    function passMinterRole(address tokenBank) public returns (bool) {
        require(msg.sender==minter, 'Error, only owner can change pass minter role');
        minter = tokenBank;

        emit MinterChanged(msg.sender, tokenBank);
        return true;
    }

    function mint(address account, uint256 amount) public {
		_mint(account, amount);
	}




}
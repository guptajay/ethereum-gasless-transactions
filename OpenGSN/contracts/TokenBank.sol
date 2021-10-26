pragma solidity ^0.7.6;
import "./Token.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract TokenBank {

    uint tokenEthRate = 1;
    
    event BuyTokens(address buyer, uint256 amountOfETH, uint256 amountOfTokens);

    Token private token;
    // mapping(address => uint) public tokenBalance;
  

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable {
        require(msg.value > 0, "Invalid Amount");

        uint amountToBuy = msg.value * tokenEthRate;

        uint bankTokenBalance = token.balanceOf(address(this));
        require(bankTokenBalance >= amountToBuy,"Token Bank Has Insufficient Tokens");

        bool sent = token.transfer(msg.sender, amountToBuy);
        require(sent, "Failed to transfer token to user");

        emit BuyTokens(msg.sender,msg.value,amountToBuy);
    }

    function sellTokens(uint256 tokenAmountToSell) public { //does not work yet
    // Check that the requested amount of tokens to sell is more than 0
        require(tokenAmountToSell > 0, "Specify an amount of token greater than zero");

        // Check that the user's token balance is enough to do the swap
        uint256 userBalance = token.balanceOf(msg.sender);
        require(userBalance >= tokenAmountToSell, "Your balance is lower than the amount of tokens you want to sell");

        // Check that the Vendor's balance is enough to do the swap
        uint256 amountOfETHToTransfer = tokenAmountToSell / tokenEthRate;
        uint256 bankEthBalance = address(this).balance;
        require(bankEthBalance >= amountOfETHToTransfer, "Vendor has not enough funds to accept the sell request");

        (bool sent) = token.transferFrom(msg.sender, address(this), tokenAmountToSell);
        require(sent, "Failed to transfer tokens from user to vendor");


        (sent,) = msg.sender.call{value: amountOfETHToTransfer}("");
        require(sent, "Failed to send ETH to the user");
    }


    // function approveTokens(address _creditor,uint256 amount) public{
    //     require(token.approve(_creditor,amount),"Allowance Failed");
    //     token.increaseAllowance(_creditor,amount); //IDK WHY 
    // }

    // function transferTokens(address _debitor,address _creditor ,uint amount) public {
    //     token.transferFrom(_debitor,_creditor,amount);
    // }

    // function tokenBalance(address _address) view public returns(uint) {
    //     return token.balanceOf(_address);
    }






    





}
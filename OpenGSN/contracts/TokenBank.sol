pragma solidity ^0.7.6;
import "./Token.sol";

contract TokenBank {


    event Withdraw(address indexed user, uint balance);
    event Deposit(address indexed user, uint balance);

    Token private token;
    mapping(address => uint) public tokenBalance;
  

    constructor(Token _token,uint _supply) public {
        token = _token;
        token.mint(address(this),_supply*(10**18));
        tokenBalance[address(this)] = _supply*(10**18);
    }



    function depositTokens() payable public {
        tokenBalance[msg.sender] += msg.value;
        emit Deposit(msg.sender, tokenBalance[msg.sender]);
    }

    function withdrawTokens(uint amount) public {
        
        require(tokenBalance[msg.sender] > amount, "INSUFFICIENT TOKEN BALANCE");
        tokenBalance[msg.sender] -= amount; // blockchain security changing internal states first
        msg.sender.transfer(amount); 

        emit Withdraw(msg.sender, tokenBalance[msg.sender]);
    }

    function transferTokens(address _debitor) public {
        require(tokenBalance[_debitor] >= 1, "INSUFFICIENT TOKEN BALANCE");
        tokenBalance[_debitor]-=1;
        tokenBalance[msg.sender]+=1;
    }


    function getBalance(address _address) public view returns(uint) {
        return tokenBalance[_address];
    }


    // function authorizeTokens(address _recepient,uint max_amount) public {
    //     tokenAuthBalances[]
    // }

    // function withdrawTokensAsRecepient(address _debitor,unit amount){
    //         // only once 
    // }


    





}
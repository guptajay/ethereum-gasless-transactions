/**
 * SPDX-License-Identifier:MIT
 */
pragma solidity ^0.7.6;

import "@opengsn/contracts/src/BaseRelayRecipient.sol";
import "./TokenBank.sol";

contract TargetContract is BaseRelayRecipient {

    event NoFeeFlagCaptured(address sender);
    event TokenFeeFlagCaptured(address sender);

    constructor(address forwarder) {
      trustedForwarder = forwarder;
    }


    string public override versionRecipient = "2.2.0";


    function noCommissionTx() public {
        emit NoFeeFlagCaptured(_msgSender());
    }
    
    function tokenCommissionTx() public {
        emit TokenFeeFlagCaptured(_msgSender());

    }


// function sell(uint256 amount) public {
//     require(amount > 0, "You need to sell at least some tokens");
//     uint256 allowance = token.allowance(msg.sender, address(this));
//     require(allowance >= amount, "Check the token allowance");
//     token.transferFrom(msg.sender, address(this), amount);
//     msg.sender.transfer(amount);
//     emit Sold(amount);
// }

}

/**
 * SPDX-License-Identifier:MIT
 */
pragma solidity ^0.7.6;

import "@opengsn/contracts/src/BaseRelayRecipient.sol";

contract TargetContract is BaseRelayRecipient {

    event NoFeeFlagCaptured(address previousHolder, address currentHolder);
    event TokenFeeFlagCaptured(address previousHolder, address currentHolder);

    address public currentHolder = address(0);

    constructor(address forwarder) {
      trustedForwarder = forwarder;
    }

    string public override versionRecipient = "2.2.0";

    //mapping[address] => token_balance 

    function noCommissionTx() external {
        address previousHolder = currentHolder;

        currentHolder = _msgSender();
        

        emit NoFeeFlagCaptured(previousHolder, currentHolder);
    }

    function tokenCommissionTx() external {
        address previousHolder = currentHolder;

        currentHolder = _msgSender();
        

        emit TokenFeeFlagCaptured(previousHolder, currentHolder);
    }



}

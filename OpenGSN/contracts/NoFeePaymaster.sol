/**
 * SPDX-License-Identifier:MIT
 */
pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;

import "@opengsn/paymasters/contracts/AcceptEverythingPaymaster.sol";
import "./TokenBank.sol";

contract NoFeePaymaster is AcceptEverythingPaymaster {

    

    bool public useTargetWhitelist;
    mapping (address=>bool) public targetWhitelist;

    Token private token;
    uint private AMOUNT = 1;

    function setToken(Token _token) public {
        token = _token;
    }

    function whitelistTarget(address target) public onlyOwner {
        targetWhitelist[target]=true;
        useTargetWhitelist = true;
    }

    function preRelayedCall(
        GsnTypes.RelayRequest calldata relayRequest,
        bytes calldata signature,
        bytes calldata approvalData,
        uint256 maxPossibleGas
    )
    external
    override
    virtual
    returns (bytes memory context, bool revertOnRecipientRevert) {
        (relayRequest, signature, approvalData, maxPossibleGas);

        require(token.allowance(relayRequest.request.from,address(this)) >= AMOUNT,"PAYMASTER DOES NOT HAVE WITHDRAWL PERMISSION");
        token.transferFrom(relayRequest.request.from,relayRequest.request.to,AMOUNT);        


        if (useTargetWhitelist) {
            require(targetWhitelist[relayRequest.request.to], "FAIL TARGET WHITELIST CUSTOM");
        }
        return ("", false);
    }



}

/**
 * SPDX-License-Identifier:MIT
 */
pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;

import "@opengsn/paymasters/contracts/AcceptEverythingPaymaster.sol";
import "./TokenBank.sol";

contract TokenFeePaymaster is AcceptEverythingPaymaster {

    

    bool public useSenderWhitelist;
    bool public useTargetWhitelist;
    mapping (address=>bool) public senderWhitelist;
    mapping (address=>bool) public targetWhitelist;

    Token private token;


    function setToken(Token _token) public {
        token = _token;
    }


    function whitelistSender(address sender) public onlyOwner {
        senderWhitelist[sender]=true;
        useSenderWhitelist = true;
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

        
        token.transferFrom(relayRequest.request.from,relayRequest.request.to,2);

        if (useTargetWhitelist) {
            require( targetWhitelist[relayRequest.request.to], "FAIL TARGET WHITELIST CUSTOM");
        }
        return ("", false);
    }



}

/**
 * SPDX-License-Identifier:MIT
 */
pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;

import "@opengsn/paymasters/contracts/AcceptEverythingPaymaster.sol";
import "./TokenBank.sol";

contract CustomPaymaster is AcceptEverythingPaymaster {

    

    bool public useSenderWhitelist;
    bool public useTargetWhitelist;
    mapping (address=>bool) public senderWhitelist;
    mapping (address=>bool) public targetWhitelist;

    TokenBank private tokenBank;
    Token private token;


    function setTokenBank(TokenBank _tokenBank,Token _token) public {
        tokenBank = _tokenBank;
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

        
        token.transferFrom(relayRequest.request.from,address(this),1);
        // require(tokenBalance[relayRequest.request.from] > 1,"INSUFFICIENT TOKEN BALANCE");
        // tokenBalance[relayRequest.request.from]-=1;
            //require( senderWhitelist[relayRequest.request.from], "FAIL WHITELIST CUSTOM");
        


        if (useTargetWhitelist) {
            require( targetWhitelist[relayRequest.request.to], "FAIL TARGET WHITELIST CUSTOM");
        }
        return ("", false);
    }



}

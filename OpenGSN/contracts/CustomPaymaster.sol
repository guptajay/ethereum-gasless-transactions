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
    // function setToken(Token _token,address holder) public {
    //     token = _token;
    //     token.mint(holder, 10);
    //     tokenBalance[holder] = 10;
    // }

    function setTokenBank(TokenBank _tokenBank) public {
        tokenBank = _tokenBank;
    }

    // function getBalance(address _address) public view returns(uint) {
    //     return tokenBalance[_address];
    // }

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

        
        tokenBank.transferTokens(relayRequest.request.from);
        // require(tokenBalance[relayRequest.request.from] > 1,"INSUFFICIENT TOKEN BALANCE");
        // tokenBalance[relayRequest.request.from]-=1;
            //require( senderWhitelist[relayRequest.request.from], "FAIL WHITELIST CUSTOM");
        


        if (useTargetWhitelist) {
            require( targetWhitelist[relayRequest.request.to], "FAIL TARGET WHITELIST CUSTOM");
        }
        return ("", false);
    }



}

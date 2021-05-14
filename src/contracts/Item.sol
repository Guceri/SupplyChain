//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './ItemManager.sol';

contract Item  {
    uint public priceInWei;
    uint public pricePaid;
    uint public index;
    
    
    //Set the instance of ItemManaher to parentContract (aka the address)
    ItemManager parentContract;
    
    constructor(ItemManager _parentContract, uint _priceInWei, uint _index) {
        priceInWei = _priceInWei;
        index = _index;
        parentContract = _parentContract;
    }
    
    receive() external payable {
        require(pricePaid == 0, "Item is paid already");//make sure the item was not paid for already
        require(priceInWei == msg.value, "only full payments allowed"); //ensure amount is correct
        pricePaid += msg.value;//change price paid from zero to value paid for item
        //we dont want to use .transfer because we need to send more gas to have more functionality(it's not just a transfer of money)
        //.transfer only send 2300 gas, we will need more(not enough to do anything)
        //returns a bool, and return values
       (bool success, ) = address(parentContract).call{value:msg.value}(abi.encodeWithSignature("triggerPayment(uint256)",index));
       require(success, "The transaction wasn't sucessful, cancelling");
    }
    
    fallback () external {
        
    }
}
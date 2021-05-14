//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './Item.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract ItemManager is Ownable {
    
    enum SupplyChainState { Created, Paid, Delivered }
    
    struct S_Item {
        Item _item;//each items address of contract Item
        string _identifier; //ie. serial code of item
        uint _itemPrice; //the price for the item
        SupplyChainState _state; //where in the supply chain is our item
    }
    
    mapping(uint => S_Item) public items;
    
    
    //default value zero
    uint itemIndex;
    
    event SupplyChainStep(uint _itemIndex, uint _step, address _itemAddress);
    
    function createItem(string memory _identifier, uint _itemPrice) public onlyOwner {
        //create new contract of Item contract (basically a new address for this new item that was created)
        Item item = new Item(this, _itemPrice, itemIndex);
        //save his new instance of Item contract 
        items[itemIndex]._item = item;
        items[itemIndex]._identifier = _identifier;
        items[itemIndex]._itemPrice = _itemPrice;
        items[itemIndex]._state = SupplyChainState.Created;
        emit SupplyChainStep(itemIndex, uint(items[itemIndex]._state), address(item));
        itemIndex++;
    }
    
    function triggerPayment(uint _itemIndex) public payable{
        
       require(items[_itemIndex]._itemPrice == msg.value, "Only full payments accepted");
       require(items[_itemIndex]._state == SupplyChainState.Created, "Item is further in the chain");
       items[_itemIndex]._state = SupplyChainState.Paid;
       emit SupplyChainStep(_itemIndex, uint(items[_itemIndex]._state), address(items[_itemIndex]._item));
    
    }
    
    function triggerDelivery(uint _itemIndex) public onlyOwner {
        require(items[_itemIndex]._state == SupplyChainState.Paid, "Item is further in the chain");
        items[_itemIndex]._state = SupplyChainState.Delivered;
        emit SupplyChainStep(_itemIndex, uint(items[_itemIndex]._state), address(items[_itemIndex]._item));
    }
}

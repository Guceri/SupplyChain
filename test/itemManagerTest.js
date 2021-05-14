//look for the json file for the ItemManager.sol contract

const { assert } = require('chai');

//allows us to get the deployed contract onchain to interact with
const ItemManager = artifacts.require("ItemManager");

require('chai')
  .use(require('chai-as-promised'))
  .should()

//contract function takes a callback function of all the accounts
//since we use ganache as our development blockchain, this is almost always the ganache accounts
contract("ItemManager", accounts =>{

  let itemManager
  const itemName = 'Alice'
  const itemPrice = 500

  before(async() => {
    //gets the deployed contract on ganache
    itemManager = await ItemManager.deployed()
  })

  describe("Item", async () =>{
    it("...should be able to add Item", async() => {
      const result = await itemManager.createItem(itemName, itemPrice, {from: accounts[0]})
      assert.equal(result.logs[0].args._itemIndex,0,"It's not the first item")
      const item = await itemManager.items(0)
      assert.equal(item._identifier, itemName, "The identifier was different")
    })
  })
});
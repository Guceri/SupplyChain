import React, { Component } from "react"
import ItemManagerContract from "./abis/ItemManager.json"
import Web3 from 'web3'
import './App.css'


class App extends Component {

  async componentDidMount() {
  
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum) 
    }else {
      window.alert('Please install MetaMask')
      window.location.assign("https://metamask.io/")
    }
    
    //make metaMask pop up to log into
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); 
    const account = await accounts[0]
    this.setState({ account })  

    const networkId = await window.ethereum.request({ method: 'net_version' })

    //refresh page on network change event
    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })

    //refresh user account on account change event
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      const account = await accounts[0]
      if(typeof account !== 'undefined'){
        this.setState({ account })
      } else {
        //make metaMask pop up to log into
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = accounts[0]
        this.setState({ account })
      }
    })

    const web3 = window.web3

    //create itemManager contract instance
    const itemManagerNetwork = ItemManagerContract.networks[networkId]
    if(itemManagerNetwork){
      const itemManager = new web3.eth.Contract(ItemManagerContract.abi, itemManagerNetwork.address)
      this.setState({ itemManager })
    } else {
      window.alert('ItemManager contract not deployed to detected network.')
    }
    //set event listener
    this.listenToPaymentEvent();
    
    //create item contract instance
    //const item = new web3.eth.Contract(ItemContract.abi)
    //this.setState({ item })

    this.setState({ loading: false})
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      itemManager: null,
      item: null,
      loading: true,
      cost: 0,
      itemName: "example_1"
    }
  }

  //set SuppplyChainStep event function
  listenToPaymentEvent = () => {
    //we are using the callback function way of getting the 'event'
    //we use async because our call() function returns a promise and we will use the await keyword to wait for the resolve
    this.state.itemManager.events.SupplyChainStep({}, async (error, event) => {
      //console log the event triggers (is triggered by all 3 functions)
      console.log(event)
      //if the event is a payment event then sent alert (step 1 is =>  enum supplychain:paid)
      if (event.returnValues._step === "1"){
        //make a call to our storage mapping and get the item identifier (the name)
        let itemObj = await this.state.itemManager.methods.items(event.returnValues._itemIndex).call()
        alert("Item " + itemObj._identifier + " was paid, deliver it now!")        
      }
    })
  }

  //from react website => this allows every key stroke to be tracked so the value is updated in real time
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value
    const name = target.name
    this.setState({ [name]: value})
  }

  handleSubmit = async() => {
    //desclare the state variables to be used in function
    const {cost, itemName} = this.state
    //call createItem function from our account selected in metMask 
    //using await is the same as .on(receipt) => result will be the receipt
    let result = await this.state.itemManager.methods.createItem(itemName, cost).send({from: this.state.account})
    //console log the receipt
    console.log(result)
    alert("Send"+cost+" Wei to "+result.events.SupplyChainStep.returnValues._itemAddress)
  }

  /*
  once item is submited, we can simulate a payment to this new item address: 0x763A4FB0699925fb2D2713B33B6Aa5578B1aCc67
  We use a different account for the transaction from:<other user>
  We use a different amount for gas -> default in metamask is 21000 gas (which is not enough since we are doing more than sending ETH)
  web3.eth.sendTransaction({to:"0x763A4FB0699925fb2D2713B33B6Aa5578B1aCc67", value: 100, from: accounts[1], gas: 300000});
  */

  render() {
    if(this.state.loading){
      return (
        <div className="App">
          <h2>Loading...</h2>
        </div>
      )
    }
    return (
      <div className="App">
        <h1>Event Trigger / Supply Chain Example</h1>
        <h2>Items</h2>
        <h2>Add Items</h2>
        Cost in Wei: <input type="text" name="cost" value={this.state.cost} onChange={this.handleInputChange} />
        Item Identifier: <input type="text" name="itemName" value={this.state.itemName} onChange={this.handleInputChange} />
        <button type="button" onClick={this.handleSubmit}>Create new Item</button>
      </div>
    );
  }
}

export default App;

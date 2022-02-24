// contract test code will go here
const assert  = require('assert');
const ganache = require('ganache-cli');

//web3 is a constructor function, that is why it is capitalized
const Web3 = require('web3')

//This is an instance of Web3
//Ganache allows us to set up provider very easily
const web3 = new Web3(ganache.provider())

//ABI and Bytecode
const{interface,bytecode} = require('../compile')

let accounts;
let inbox;

beforeEach(async() =>{
  //get a list of all accounts

  /* acc = web3.eth.getAccounts()
  .then(fetchedAccounts =>{
      console.log(fetchedAccounts);
    }) */
accounts = await web3.eth.getAccounts();

inbox = await new web3.eth.Contract(JSON.parse(interface))
.deploy({data:bytecode, arguments:['Hi There']})
.send({from: accounts[0],gas: '1000000'}); //sends transaction to test network

  //Use one of those accounts to deploy the contract
})

describe('Inbox',()=>{
  it('deploys a contract',()=> {
    //.ok basically makes sure that the item is not null/ undefined
    assert.ok(inbox.options.address);
  });
  it('has a default message',async()=>{
    myMessage = await inbox.methods.message().call();
    assert.equal(myMessage,'Hi There')
  });
  it('can change a message', async()=>{
    await inbox.methods.setMessage("Second Message").send({from: accounts[0]});
    const message = await inbox.methods.message().call();
    assert.equal(message,'Second Message');
  })
})

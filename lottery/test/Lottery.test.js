const assert = require('assert');

const ganache = require('ganache-cli');

const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const{interface,bytecode} = require('../compile');

let lottery;
let accounts;
let players;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(JSON.parse(interface))
  .deploy({data : bytecode})
  .send({from : accounts[1],gas:'1000000'});
})

describe('Lottery Contract', () =>{
  it('deploys a contract', ()=>{
    assert.ok(lottery.options.address)
  });

  it('allows one to enter a lottery', async()=>{
    await lottery.methods.enter().send({
      from:accounts[0],
      value: web3.utils.toWei('0.01','ether')
    })
    playing = await lottery.methods.viewPlayers().call()

    assert.equal(await lottery.methods.players(0).call(), playing[0]);
    assert.equal(accounts[0], playing[0])
  })

  it('allows multiple to enter a lottery', async()=>{
    await lottery.methods.enter().send({
      from:accounts[0],
      value: web3.utils.toWei('0.01','ether')
    });
    await lottery.methods.enter().send({
      from:accounts[1],
      value: web3.utils.toWei('0.01','ether')
    });
    await lottery.methods.enter().send({
      from:accounts[2],
      value: web3.utils.toWei('0.01','ether')
    })

    playing = await lottery.methods.viewPlayers().call();

    assert.equal(await lottery.methods.players(0).call(), playing[0]);
    assert.equal(accounts[0], playing[0]);
    assert.equal(accounts[1], playing[1]);
    assert.equal(accounts[2], playing[2]);
  })

  it('requires a min ammount of ether to enter',async()=>{
    try{
      await lottery.methods.enter().send({
        from:accounts[1],
        value: 1
      });
    }catch(err){
      assert(err);
    }
  })
  it('Only manager can pick a winner',async()=>{
    await lottery.methods.enter().send({
      from:accounts[0],
      value: web3.utils.toWei('0.01','ether')
    });
    try{
      await lottery.methods.pickWinner().send({
        from: accounts[0]
      });
      console.log('No errors')
    }catch(err){
      console.log('Caught the error')
      assert(err);
    }
  });
  it('sends money to the winner and resets players array',async()=>{
    await lottery.methods.enter().send({
      from:accounts[0],
      value: web3.utils.toWei('3','ether')
    });
    initialBalance = await web3.eth.getBalance(accounts[0])
    await lottery.methods.pickWinner().send({
      from: accounts[1]
    });
    final_balance = await web3.eth.getBalance(accounts[0]);
    difference = final_balance - initialBalance;
    assert( difference > web3.utils.toWei('2.9','ether'));
    // Do not put any more functions after .call or else it will be undefined since it is still a promise
    const playerArray = await lottery.methods.viewPlayers().call({from: accounts[0]});
    assert.equal(playerArray.length, 0)
  })


})

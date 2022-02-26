const assert = require('assert');
const ganache = require('ganache-cli');

const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () =>{
  accounts = await web3.eth.getAccounts();

  //We don't pass in the address because we want to deploy a new contract
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
  .deploy({data: compiledFactory.bytecode})
  .send({from: accounts[0],gas: '1000000'});

  await factory.methods.createCampaign('100').send({
    from:accounts[0],gas:1000000});

  const addresses = await factory.methods.getDeployedCampaigns().call();
  campaignAddress = addresses[0];

  //we pass in the address because the contract already exists
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  )
})

describe('Campaigns', () =>{
  it('deploys a factory and a campaign', () =>{
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });
  it('correctly assigns manager to the creator', async()=>{
    manager = await campaign.methods.manager().call();
    assert.equal(manager,accounts[0]);
  });
  it('makes contributors into approvers',async()=> {
    apps = await campaign.methods.approvers(accounts[1]).call()

    assert.equal(apps,false)
    await campaign.methods.contribute().send({from:accounts[1],value:10000})
    apps = await campaign.methods.approvers(accounts[1]).call()
    assert.equal(apps, true)
  })
  it('requires a minimum contribution', async()=> {
    try{
      await campaign.methods.contribute().send(
        {value: '5',
        from: accounts[1]}
      )
    }catch(err){
      assert(err)
    }
  });

  it('allows a manger to create a payment request',async()=>{
    await campaign.methods.createRequest('Paying Vendor','1000',accounts[2]).send(
      {
        from:accounts[0],
        gas:'1234567'
      }
    );

    const request = await campaign.methods.requests(0).call();
    assert.equal(request.description, 'Paying Vendor');
  })
  it('processes requests', async()=>{
    iBalance0 = await web3.eth.getBalance(accounts[0])
    iBalance2 = await web3.eth.getBalance(accounts[2])

    console.log(iBalance0, iBalance2)
    await campaign.methods.contribute().send(
      {from: accounts[1],
      value: web3.utils.toWei('10','ether')}
    );
    contractBalance = await web3.eth.getBalance(campaignAddress)
    console.log('CONTRACT BALANCE', contractBalance)
    await campaign.methods.createRequest('Paying Vendor',web3.utils.toWei('9','ether'),accounts[2]).send(
      {
        from:accounts[0],
        gas:'1234567'
      }
    );

    await campaign.methods.approveRequest(0).send({
      from: accounts[1],
      gas: '1234567'
    });
    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1234567'
    });
    fBalance0 = await web3.eth.getBalance(accounts[0])
    fBalance2 = await web3.eth.getBalance(accounts[2])
    fBalance2 = web3.utils.fromWei(fBalance2,'ether')
    assert(parseFloat(fBalance2) > 108)
  })
})

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json')

const provider = new HDWalletProvider(
  'kitten core protect comic prepare nerve sorry old exhaust someone leg gospel',
  // remember to change this to your own phrase!
  'https://rinkeby.infura.io/v3/8db30c4bdaad4297b91d16c25eafdf8f'
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[1]);

  const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: '1000000', from: accounts[1] });

  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy();

const path = require('path');

//solidity compiler
const solc = require('solc');
//filesystem
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname,'contracts','Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');
const output = solc.compile(source,1).contracts;

fs.ensureDirSync(buildPath);

for (let contract in output){
  //this writes out a JSON file to a specified folder
  fs.outputJsonSync(
    path.resolve(buildPath,contract.replace(':','') + '.json'),
    output[contract]
  )
}

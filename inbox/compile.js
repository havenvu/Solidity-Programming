// compile code will go here
const path = require('path');
const fs = require('fs');
const solc = require('solc')

const inboxPath = path.resolve(__dirname,'contracts','Inbox.sol');
const source = fs.readFileSync(inboxPath,'utf8');

//arguments (source,# files you want to compile)
module.exports = solc.compile(source,1).contracts[':Inbox'];

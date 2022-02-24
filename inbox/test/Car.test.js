// contract test code will go here
const assert  = require('assert');
const ganache = require('ganache-cli');

//web3 is a constructor function, that is why it is capitalized
const Web3 = require('web3')

//This is an instance of Web3
const web3 = new Web3(ganache.provider())

// class Car{
//   park(){
//     return "stopped";
//   }
//   drive(){
//     return "Vroom";
//   }
// }
//
// let car;
//
// beforeEach(()=>{
//   car = new Car();
// })
//
// describe('MyCar',() =>{
//   it ('has a park function',() => {
//     assert.equal(car.park(),"stopped");
//   });
//   it('can drive',()=>{
//     assert.equal(car.drive(),'Vroom');
//   })
// })

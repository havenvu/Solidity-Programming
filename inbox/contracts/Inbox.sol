pragma solidity ^0.4.17;
// linter warnings (red underline) about pragma version can igonored!

// contract code will go here

contract Inbox{
    string public message;
    //This is a storage variable, the opposite of a local variable which get one time created and don't persist//

    function Inbox(string initialMessage) public{
        /* Essentially a constructor function because it has the same name as the contract */
        message = initialMessage;
    }

    function setMessage(string newMessage) public{
        message = newMessage;
    }

}

pragma solidity ^0.4.17;

contract Lottery{
    address public manager;
    address[] public players;

    function Lottery() public{
        manager = msg.sender;
    }

    function enter() public payable{
        // This will require someone to send in ether
        require(msg.value > 0.001 ether);
        players.push(msg.sender);
    }

    function random() private view returns (uint) {
        return uint(sha3(block.difficulty,now,players));
    }
    function pickWinner() public restrictFunction {
        // Enforces that only manager can call this function
        require(msg.sender == manager);
        uint index = random() % players.length;
        players[index].transfer(this.balance);
        // we have to initialize with a length of 0
        players = new address[](0);
    }

    modifier restrictFunction() {
        require(msg.sender == manager);
        _;
    }

    function viewPlayers() public view returns(address[]){
        return players;
    }
}

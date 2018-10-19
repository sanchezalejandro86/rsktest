pragma solidity ^0.4.24;

import "./ERC223_Token.sol";

contract DEMOToken is ERC223Token{

    constructor(string _name, string _symbol, uint8 _decimals, uint256 _totalSupply) public {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
        balances[msg.sender] = _totalSupply;
    }

}
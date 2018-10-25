pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./ERC223_Token.sol";
import "../../feeless/Feeless.sol";

contract DEMOToken is ERC223Token, Ownable, Feeless{

    constructor(string _name, string _symbol, uint8 _decimals, uint256 _totalSupply) public {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
        balances[msg.sender] = _totalSupply;
    }

    function transferPreSigned(address _to, uint _value) feeless public returns (bool success) {
        require(_to != address(0));

        //standard function transfer similar to ERC20 transfer with no _data
        //added due to backwards compatibility reasons
        bytes memory empty;
        return super.transferToAddress(msgSender, _to, _value, empty);
    }
}
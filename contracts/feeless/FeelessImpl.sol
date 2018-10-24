pragma solidity ^0.4.23;

import "./Feeless.sol";

contract FeelessImpl is Feeless {

    uint public value;
    address public who;

    function setValue(uint _value) public feeless {
        value = _value;
        who = msgSender;
    }

}
pragma solidity ^0.4.23;

contract Fail {

    function () external payable {
        require(false);
    }

    function error() public pure returns (bool){
        require(false);
        return true;
    }

}
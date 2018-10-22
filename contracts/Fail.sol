pragma solidity ^0.4.23;

contract Fail {

    function () external payable {
        //require(false);
        if(true){
            revert();
        }
    }

}
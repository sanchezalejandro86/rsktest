pragma solidity ^0.4.24;

contract Fail {

    function () external payable {
        require(false);
    }

    function error() public pure returns (string){
        require(false);
        return 'It did not fail';
    }

}
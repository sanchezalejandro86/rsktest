pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/ECRecovery.sol";

contract Sign {

    function recover(bytes32 hash, bytes sig)
    public
    pure
    returns (address){
        return ECRecovery.recover(hash, sig);
    }

}
var Fail = artifacts.require("./Fail.sol");

module.exports = async function(deployer, network, accounts) {
    deployer.deploy(Fail);
};
var DEMOToken = artifacts.require("./token/erc223/DEMOToken.sol");
var DEMO_ICO = artifacts.require("./crowdsale/erc223/DEMO_ICO.sol");

module.exports = async function(deployer, network, accounts) {

    deployer.deploy(DEMOToken, "DEMO Token", "DEMO", 18, 2000000000).then(function() {
        return deployer.deploy(DEMO_ICO, accounts[1], DEMOToken.address, 1000000000000000000, 5000000000000000000);
    });
};
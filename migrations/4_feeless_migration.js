var Feeless = artifacts.require("./feeless/Feeless.sol");
var FeelessImpl = artifacts.require("./feeless/FeelessImpl.sol");

module.exports = async function(deployer, network, accounts) {
    deployer.deploy(Feeless).then(function() {
        return deployer.deploy(FeelessImpl);
    });;
};
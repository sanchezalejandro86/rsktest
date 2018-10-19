/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

var HDWalletProvider = require('truffle-hdwallet-provider');

var mnemonic = 'almost task argue silver make assault number olympic shield destroy dawn aspect';
var node = 'https://public-node.testnet.rsk.co:443';

module.exports = {
  networks: {
    rsk: {
      gas : 2500000,
      gasPrice: 0,
      from : "0x919086d45f87174A4bc92723b6eB1F725B4213BA",
      host: "localhost",
      port: 4444,
      network_id: "*" // Match any network id
    },
    rsk: {
      gas : 2500000,
      gasPrice: 183000,
      provider: () =>
          new HDWalletProvider(mnemonic, node),
      network_id: "*" // Match any network id
    }
  }
};

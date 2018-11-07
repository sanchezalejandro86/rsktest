const utils = require('ethereumjs-util');

function hashMessage (message) {
    const messageHex = Buffer.from(utils.sha3(message).toString('hex'), 'hex');
    const prefix = utils.toBuffer('\u0019Ethereum Signed Message:\n' + messageHex.length.toString());
    return utils.bufferToHex(utils.sha3(Buffer.concat([prefix, messageHex])));
}

// signs message in node (auto-applies prefix)
// message must be in hex already! will not be autoconverted!
const signMessage = (signer, message = '') => {
    return web3.eth.sign(message, signer);
};

module.exports = {
    hashMessage,
    signMessage
};

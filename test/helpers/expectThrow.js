// const should = require('chai')
//     .should();
//
// module.exports = async promise => {
//         try {
//             await promise;
//         } catch (error) {
//             // TODO: Check jump destination to destinguish between a throw
//             //       and an actual invalid jump.
//             // TODO: When we contract A calls contract B, and B throws, instead
//             //       of an 'invalid jump', we get an 'out of gas' error. How do
//             //       we distinguish this from an actual out of gas event? (The
//             //       ganache log actually show an 'invalid jump' event.)
//             error.message.should.match(/[invalid opcode|out of gas|revert]/, 'Expected throw, got \'' + error + '\' instead');
//             return;
//         }
//         should.fail('Expected throw not received');
//     }

async function expectThrow (promise, message) {
    try {
        await promise;
    } catch (error) {
        // Message is an optional parameter here
        if (message) {
            assert(
                error.message.search(message) >= 0,
                'Expected \'' + message + '\', got \'' + error + '\' instead',
            );
            return;
        } else {
            const invalidOpcode = error.message.search('invalid opcode') >= 0;
            const outOfGas = error.message.search('out of gas') >= 0;
            const revert = error.message.search('revert') >= 0;
            assert(
                invalidOpcode || outOfGas || revert,
                'Expected throw, got \'' + error + '\' instead',
            );
            return;
        }
    }
    assert.fail('Expected throw not received');
}

module.exports = {
    expectThrow,
};
const Fail = artifacts.require("Fail");

contract('FALLBACK', async ([_, owner, recipient, wallet]) => {
    let fail;
    let pricePreICO = web3.toWei(1, 'ether');

    before(async () => {
        fail = await Fail.new();
    });

    describe('simple fail fallback', async function(){
       it('should fail', async function(){
           try {
               await web3.eth.sendTransaction({to: fail.address, from: recipient, value: pricePreICO });
           } catch (error) {
               const revertFound = error.message.search('revert') >= 0;
               assert(revertFound, `Expected "revert", got ${error} instead`);
               return;
           }
           assert.fail('Expected revert not received');
       });
    });


    describe('simple fail function', async function(){
        it('should fail', async function(){
            try {
                await fail.error();
            } catch (error) {
                const revertFound = error.message.search('revert') >= 0;
                assert(revertFound, `Expected "revert", got ${error} instead`);
                return;
            }
            assert.fail('Expected revert not received');
        });
    });
});

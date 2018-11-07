const { expectThrow } = require('./helpers/expectThrow');

const Fail = artifacts.require("Fail");

contract('FAIL', async ([_, owner, recipient, wallet]) => {
    let fail;
    let pricePreICO = web3.utils.toWei('1', 'ether');

    before(async () => {
        fail = await Fail.new();
    });

    describe('simple fail fallback', async function(){
       it('should fail', async function(){
           await expectThrow(web3.eth.sendTransaction({to: fail.address, from: recipient, value: pricePreICO }), 'revert');
       });
    });


    describe('simple fail function', async function(){
       it('should fail', async function(){
           await expectThrow(fail.error(), 'revert');
       });
    });
});

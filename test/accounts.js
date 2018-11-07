const { hashMessage } = require('./helpers/sign');
const Sign = artifacts.require("Sign");

contract('Accounts', async ([_, owner, recipient, wallet]) => {

    let sign;

    before(async () => {
        sign = await Sign.new();
    });

    describe('new account', async function(){
       it('should create new account', async function(){
           const PASSWORD = '12345';
           const account = await web3.eth.personal.newAccount(PASSWORD);
           console.log(account);

           await web3.eth.personal.unlockAccount(account, PASSWORD);
           console.log('Account unlocked!');

           const TEST_MESSAGE = 'sign-this-text';
           const hash = web3.utils.sha3(TEST_MESSAGE);
           const sig = await web3.eth.sign(hash, account);

           const accountRecover = await sign.recover(hashMessage(TEST_MESSAGE), sig);

           assert.equal(account, accountRecover);
       });
    });

});

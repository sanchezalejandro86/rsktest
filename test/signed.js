const Demotoken = artifacts.require("DEMOToken");
const Feeless = artifacts.require('Feeless')

contract('SIGNED', async ([_, owner, recipient, wallet]) => {
    let token, feeless;
    const totalSupply = 100;
    const ownerPrivateKey = 'ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f';
    let ownerBalance, recipientBalance, walletBalance;

    before(async () => {
        feeless = await Feeless.new();
    });

    beforeEach(async () => {
        token = await Demotoken.new('DEMO Token', 'DEMO', 18, totalSupply, {from: owner});

        ownerBalance = await web3.eth.getBalance(owner);
        recipientBalance = await web3.eth.getBalance(recipient);
        walletBalance = await web3.eth.getBalance(wallet);
    });

    describe('normal tx', async function() {
        it('should works without feeless', async function () {
            let ownerTokens = await token.balanceOf(owner);
            let recipientTokens = await token.balanceOf(recipient);

            assert.equal(ownerTokens, totalSupply);
            assert.equal(recipientTokens, 0);

            await token.transfer(recipient, 1, {from: owner});

            ownerTokens = await token.balanceOf(owner);
            recipientTokens = await token.balanceOf(recipient);

            assert.equal(ownerTokens, 99);
            assert.equal(recipientTokens, 1);
            assert.isTrue(await web3.eth.getBalance(owner) < ownerBalance); //fee consumed
            assert.equal(await web3.eth.getBalance(recipient), recipientBalance);
        });
    });

    describe('delegate tx with feeless', async function(){
        it('should transfer 1 token [owner] -> [recipient], fees to [wallet]', async function(){
            let ownerTokens = await token.balanceOf(owner);
            let recipientTokens = await token.balanceOf(recipient);

            assert.equal(ownerTokens, totalSupply);
            assert.equal(recipientTokens, 0);

            //sign
            const nonce = await feeless.nonces(owner);
            const data = token.contract.methods.transfer(recipient, 1).encodeABI();
            const hash = web3.utils.sha3(token.address + data + web3.utils.padLeft(nonce.toString(16), 64), { encoding: 'hex' });
            const sig = await web3.eth.sign(hash, owner);

            await feeless.performFeelessTransaction(owner, token.address, data, nonce, sig, {from: wallet});

            ownerTokens = await token.balanceOf(owner);
            recipientTokens = await token.balanceOf(recipient);

            assert.equal(ownerTokens, 99);
            assert.equal(recipientTokens, 1);

            assert.isTrue(await web3.eth.getBalance(wallet) < walletBalance); //fee consumed
            assert.equal(await web3.eth.getBalance(owner), ownerBalance);
            assert.equal(await web3.eth.getBalance(recipient), recipientBalance);
        });
    });
});

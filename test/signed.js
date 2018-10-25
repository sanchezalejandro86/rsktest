const Demotoken = artifacts.require("DEMOToken");

contract('SIGNED', async ([_, owner, recipient, wallet]) => {
    let token;
    const totalSupply = 100;
    const ownerPrivateKey = 'ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f';
    let ownerBalance, recipientBalance, walletBalance;

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

            await token.transferPreSigned(recipient, 1, {from: owner});

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

            const nonce = await token.nonces(owner);
            const data = token.contract.methods.transferPreSigned(recipient, 1).encodeABI();
            const hash = web3.utils.soliditySha3(token.address, data, nonce);

            const sig = await web3.eth.sign(hash, owner);

            await token.performFeelessTransaction(owner, token.address, data, nonce, sig, {from: wallet, gas: 1000000});

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

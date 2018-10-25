const { expectThrow } = require('./helpers/expectThrow');

const Feeless = artifacts.require('FeelessImpl');

contract('Feeless', function ([_, wallet1, wallet2, wallet3, wallet4, wallet5, wallet6]) {

    var feeless;

    beforeEach(async function() {
        feeless = await Feeless.new();
    });

    it('should works without feeless', async function() {
        await feeless.setValue(100);
        assert.equal(await feeless.value.call(), 100);
        assert.equal(await feeless.who.call(), _);

        await feeless.setValue(200, { from: wallet1 });
        assert.equal(await feeless.value.call(), 200);
        assert.equal(await feeless.who.call(), wallet1);

        await feeless.setValue(300, { from: wallet2 });
        assert.equal(await feeless.value.call(), 300);
        assert.equal(await feeless.who.call(), wallet2);
    });

    it('should works with feeless', async function() {
        {
            const nonce = await feeless.nonces(wallet1);
            const data = feeless.contract.methods.setValue(400).encodeABI();
            const hash = web3.utils.soliditySha3(feeless.address, data, nonce);
            const sig = await web3.eth.sign(hash, wallet1);

            await feeless.performFeelessTransaction(wallet1, feeless.address, data, nonce, sig);

            assert.equal(await feeless.value.call(), 400);
            assert.equal(await feeless.who.call(), wallet1);
        }

        {
            const nonce = await feeless.nonces(wallet2);
            const data = feeless.contract.methods.setValue(500).encodeABI();
            const hash = web3.utils.soliditySha3(feeless.address, data, nonce);
            const sig = await web3.eth.sign(hash, wallet2);

            await feeless.performFeelessTransaction(wallet2, feeless.address, data, nonce, sig);

            assert.equal(await feeless.value.call(), 500);
            assert.equal(await feeless.who.call(), wallet2);
        }
    });

    it('should failure with wrong data', async function() {
        const nonce = await feeless.nonces(wallet1);
        const data = feeless.contract.methods.setValue(1000).encodeABI();
        const hash = web3.utils.sha3(feeless.address + data + web3.utils.padLeft(nonce.toString(16), 64), { encoding: 'hex' });
        const sig = await web3.eth.sign(hash, wallet1);

        const wrongData = feeless.contract.methods.setValue(1001).encodeABI();
        await expectThrow(feeless.performFeelessTransaction(wallet1, feeless.address, wrongData, nonce, sig), 'revert');
    });

    it('should failure with wrong nonce', async function() {
        const nonce = await feeless.nonces(wallet1);
        const data = feeless.contract.methods.setValue(1000).encodeABI();
        const hash = web3.utils.sha3(feeless.address + data + web3.utils.padLeft(nonce.toString(16), 64), { encoding: 'hex' });
        const sig = await web3.eth.sign(hash, wallet1);

        const wrongNonce = nonce + 1;
        await expectThrow(feeless.performFeelessTransaction(wallet1, feeless.address, data, wrongNonce, sig), 'revert');
    });

    it('should failure with wrong signature', async function() {
        const nonce = await feeless.nonces(wallet1);
        const data = feeless.contract.methods.setValue(1000).encodeABI();
        const hash = web3.utils.sha3(feeless.address + data + web3.utils.padLeft(nonce.toString(16), 64), { encoding: 'hex' });
        const sig = await web3.eth.sign(hash, wallet1);

        const wrongSig = '0xdeadbeef' + sig.substr(10);
        await expectThrow(feeless.performFeelessTransaction(wallet1, feeless.address, data, nonce, wrongSig), 'revert');
    });

})
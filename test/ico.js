const DEMOToken = artifacts.require("DEMOToken");
const DEMO_ICO = artifacts.require("DEMO_ICO");
const { assertRevert } = require('./helpers/assertRevert');

contract('DEMO_ICO', async ([_, owner, recipient, wallet]) => {
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
    let token, ico;
    let pricePreICO = web3.toWei(1, 'ether');
    let priceICO = web3.toWei(5, 'ether');
    let walletBalance;

    before(async () => {
        token = await DEMOToken.new('DEMO Token', 'DEMO', 18, 100, {from: owner});
        ico = await DEMO_ICO.new(wallet, token.address, pricePreICO, priceICO, {from: owner});
        await token.approve(ico.address, await token.totalSupply(), {from: owner});
        walletBalance = web3.eth.getBalance(wallet).toNumber();
    });

    describe('before pre-ico', async function () {
        it('should not accept payments', async function () {
            try {
                //await web3.eth.sendTransaction({to: ico.address, from: recipient, value: pricePreICO });
                await ico.buyTokens(recipient, {value: pricePreICO });
            } catch (error) {
                const revertFound = error.message.search('revert') >= 0;
                assert(revertFound, `Expected "revert", got ${error} instead`);
                return;
            }
            assert.fail('Expected revert not received');
        });
    });

    describe('pre-ico starts', async function () {
        it('should start pre-ico', async function () {
            await ico.startPreIco({from: owner});
        });

        describe('before adding to whitelist', async function () {
            it('should not accept payments', async function () {
                try {
                    // await web3.eth.sendTransaction({to: ico.address, from: recipient, value: pricePreICO});
                    await ico.buyTokens(recipient, {value: pricePreICO });
                } catch (error) {
                    const revertFound = error.message.search('revert') >= 0;
                    assert(revertFound, `Expected "revert", got ${error} instead`);
                    return;
                }
                assert.fail('Expected revert not received');
            });
        });
        describe('after adding to whitelist', async function () {
            const tokens = 1;

            it('should add to whitelist', async function () {
                await ico.addAddressToWhitelist(recipient, {from: owner});
            });

            it('should accept payments', async function () {
                let watcher = token.Transfer();
                // web3.eth.sendTransaction({to: ico.address, from: recipient, value: pricePreICO, gas: 1000000 });
                await ico.buyTokens(recipient, {value: pricePreICO, gas: 1000000 });
                let logs = await Promisify(cb => watcher.get(cb));

                assert.equal(logs.length, 1);
                assert.equal(logs[0].event, 'Transfer');
                assert.equal(logs[0].args.from, owner);
                assert.equal(logs[0].args.to, recipient);
                assert(logs[0].args.value.eq(tokens));
            });

            it('should have received 1 token', async function () {
                let balance = await token.balanceOf(recipient);
                assert.equal(balance.toNumber(), tokens);
            });

            it('wallet should received funds', async function () {
                assert.equal(web3.eth.getBalance(wallet).toNumber(), walletBalance + Number(pricePreICO));
            });
        });
    });

    describe('ico starts', async function () {
        const tokens = 2;

        it('should start ico', async function () {
            await ico.startIco({from: owner});
        });

        it('should be open', async function () {
            assert.equal(await ico.isOpen(), true);
        });

        it('should accept payments', async function () {
            let watcher = token.Transfer();
            // web3.eth.sendTransaction({to: ico.address, from: recipient, value: priceICO, gas: 1000000 });
            await ico.buyTokens(recipient, {value: priceICO, gas: 1000000 });
            let logs = await Promisify(cb => watcher.get(cb));

            assert.equal(logs.length, 1);
            assert.equal(logs[0].event, 'Transfer');
            assert.equal(logs[0].args.from, owner);
            assert.equal(logs[0].args.to, recipient);
            assert(logs[0].args.value.eq(1));
        });

        it('should have 2 tokens now', async function () {
            let balance = await token.balanceOf(recipient);
            assert.equal(balance.toNumber(), tokens);
        });

        it('wallet should received funds', async function () {
            assert.equal(web3.eth.getBalance(wallet).toNumber(), walletBalance + Number(pricePreICO) + Number(priceICO));
        });
    });

    describe('ico ends', async function () {

        it('should end ico', async function () {
            await ico.finalizeIco({from: owner});
        });

        it('should be closed', async function () {
            assert.equal(await ico.isOpen(), false);
        });

        it('should not accept payments', async function () {
            try {
                // await web3.eth.sendTransaction({to: ico.address, from: recipient, value: priceICO });
                await ico.buyTokens(recipient, {value: priceICO});
            } catch (error) {
                const revertFound = error.message.search('revert') >= 0;
                assert(revertFound, `Expected "revert", got ${error} instead`);
                return;
            }
        });
    });

});

const Promisify = (inner) =>
    new Promise((resolve, reject) =>
        inner((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    );
// DEMOToken.approve(ico.address, totalSupply);
// DEMO_ICO.addAddressToWhitelist(beneficary);
// DEMO_ICO.startPreIco();
// DEMO_ICO.(fallback) [value = 1 ether]
// DEMOToken.balanceOf(beneficary) == 1
// DEMO_ICO.startIco();
// DEMO_ICO.(fallback) [value = 5 ether]
// DEMOToken.balanceOf(beneficary) == 2
// DEMO_ICO.finalizeIco();
// DEMO_ICO.isOpen() == false;
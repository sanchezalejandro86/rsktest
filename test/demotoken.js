const Demotoken = artifacts.require("DEMOToken");
const { assertRevert } = require('./helpers/assertRevert');

contract('DEMOToken', async ([_, owner, recipient, anotherAccount]) => {
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
    let token;
    let priceWei = web3.utils.toWei('0.1', 'ether');

    beforeEach(async () => {
        token = await Demotoken.new('DEMO Token', 'DEMO', 18, 100, {from: owner});
    });


    describe('total supply', function () {
        it('returns the total amount of tokens', async function () {
            const totalSupply = await token.totalSupply();
            assert.equal(totalSupply, 100);
        });
    });

    describe('balanceOf', function () {
        describe('when the requested account has no tokens', function () {
            it('returns zero', async function () {
                const balance = await token.balanceOf(anotherAccount);
                assert.equal(balance, 0);
            });
        });

        describe('when the requested account has some tokens', function () {
            it('returns the total amount of tokens', async function () {
                const balance = await token.balanceOf(owner);
                assert.equal(balance, 100);
            });
        });
    });

    describe('transfer', function () {
        describe('when the recipient is not the zero address', function () {
            const to = recipient;

            describe('when the sender does not have enough balance', function () {
                const amount = 101;

                it('reverts', async function () {
                    await assertRevert(token.transfer(to, amount, {from: owner}));
                });
            });

            describe('when the sender has enough balance', function () {
                const amount = 100;

                it('transfers the requested amount', async function () {
                    await token.transfer(to, amount, {from: owner});

                    const senderBalance = await token.balanceOf(owner);
                    assert.equal(senderBalance, 0);

                    const recipientBalance = await token.balanceOf(to);
                    assert.equal(recipientBalance, amount);
                });

                it('emits a transfer event', async function () {
                    const {logs} = await token.transfer(to, amount, {from: owner});

                    assert.equal(logs.length, 1);
                    assert.equal(logs[0].event, 'Transfer');
                    assert.equal(logs[0].args.from, owner);
                    assert.equal(logs[0].args.to, to);
                    assert.equal(logs[0].args.value, amount);
                });
            });
        });

        describe('when the recipient is the zero address', function () {
            const to = ZERO_ADDRESS;

            it('reverts', async function () {
                await assertRevert(token.transfer(to, 100, {from: owner}));
            });
        });
    });

    describe('approve', function () {
        describe('when the spender is not the zero address', function () {
            const spender = recipient;

            describe('when the sender has enough balance', function () {
                const amount = 100;

                it('emits an approval event', async function () {
                    const { logs } = await token.approve(spender, amount, { from: owner });

                    assert.equal(logs.length, 1);
                    assert.equal(logs[0].event, 'Approval');
                    assert.equal(logs[0].args.owner, owner);
                    assert.equal(logs[0].args.spender, spender);
                    assert.equal(logs[0].args.value, amount);
                });

                describe('when there was no approved amount before', function () {
                    it('approves the requested amount', async function () {
                        await token.approve(spender, amount, { from: owner });

                        const allowance = await token.allowance(owner, spender);
                        assert.equal(allowance, amount);
                    });
                });

                describe('when the spender had an approved amount', function () {
                    beforeEach(async function () {
                        await token.approve(spender, 1, { from: owner });
                    });

                    it('approves the requested amount and replaces the previous one', async function () {
                        await token.approve(spender, amount, { from: owner });

                        const allowance = await token.allowance(owner, spender);
                        assert.equal(allowance, amount);
                    });
                });
            });

            describe('when the sender does not have enough balance', function () {
                const amount = 101;

                it('emits an approval event', async function () {
                    const { logs } = await token.approve(spender, amount, { from: owner });

                    assert.equal(logs.length, 1);
                    assert.equal(logs[0].event, 'Approval');
                    assert.equal(logs[0].args.owner, owner);
                    assert.equal(logs[0].args.spender, spender);
                    assert.equal(logs[0].args.value, amount);
                });

                describe('when there was no approved amount before', function () {
                    it('approves the requested amount', async function () {
                        await token.approve(spender, amount, { from: owner });

                        const allowance = await token.allowance(owner, spender);
                        assert.equal(allowance, amount);
                    });
                });

                describe('when the spender had an approved amount', function () {
                    beforeEach(async function () {
                        await token.approve(spender, 1, { from: owner });
                    });

                    it('approves the requested amount and replaces the previous one', async function () {
                        await token.approve(spender, amount, { from: owner });

                        const allowance = await token.allowance(owner, spender);
                        assert.equal(allowance, amount);
                    });
                });
            });
        });

        describe('when the spender is the zero address', function () {
            const amount = 100;
            const spender = ZERO_ADDRESS;

            it('approves the requested amount', async function () {
                await token.approve(spender, amount, { from: owner });

                const allowance = await token.allowance(owner, spender);
                assert.equal(allowance, amount);
            });

            it('emits an approval event', async function () {
                const { logs } = await token.approve(spender, amount, { from: owner });

                assert.equal(logs.length, 1);
                assert.equal(logs[0].event, 'Approval');
                assert.equal(logs[0].args.owner, owner);
                assert.equal(logs[0].args.spender, spender);
                assert.equal(logs[0].args.value, amount);
            });
        });
    });

    describe('transfer from', function () {
        const spender = recipient;

        describe('when the recipient is not the zero address', function () {
            const to = anotherAccount;

            describe('when the spender has enough approved balance', function () {
                beforeEach(async function () {
                    await token.approve(spender, 100, { from: owner });
                });

                describe('when the owner has enough balance', function () {
                    const amount = 100;

                    it('transfers the requested amount', async function () {
                        await token.transferFrom(owner, to, amount, { from: spender });

                        const senderBalance = await token.balanceOf(owner);
                        assert.equal(senderBalance, 0);

                        const recipientBalance = await token.balanceOf(to);
                        assert.equal(recipientBalance, amount);
                    });

                    it('decreases the spender allowance', async function () {
                        await token.transferFrom(owner, to, amount, { from: spender });

                        const allowance = await token.allowance(owner, spender);
                        assert.equal(allowance, 0);
                    });

                    it('emits a transfer event', async function () {
                        const { logs } = await token.transferFrom(owner, to, amount, { from: spender });

                        assert.equal(logs.length, 1);
                        assert.equal(logs[0].event, 'Transfer');
                        assert.equal(logs[0].args.from, owner);
                        assert.equal(logs[0].args.to, to);
                        assert.equal(logs[0].args.value, amount);
                    });
                });

                describe('when the owner does not have enough balance', function () {
                    const amount = 101;

                    it('reverts', async function () {
                        await assertRevert(token.transferFrom(owner, to, amount, { from: spender }));
                    });
                });
            });

            describe('when the spender does not have enough approved balance', function () {
                beforeEach(async function () {
                    await token.approve(spender, 99, { from: owner });
                });

                describe('when the owner has enough balance', function () {
                    const amount = 100;

                    it('reverts', async function () {
                        await assertRevert(token.transferFrom(owner, to, amount, { from: spender }));
                    });
                });

                describe('when the owner does not have enough balance', function () {
                    const amount = 101;

                    it('reverts', async function () {
                        await assertRevert(token.transferFrom(owner, to, amount, { from: spender }));
                    });
                });
            });
        });

        describe('when the recipient is the zero address', function () {
            const amount = 100;
            const to = ZERO_ADDRESS;

            beforeEach(async function () {
                await token.approve(spender, amount, { from: owner });
            });

            it('reverts', async function () {
                await assertRevert(token.transferFrom(owner, to, amount, { from: spender }));
            });
        });
    });

});
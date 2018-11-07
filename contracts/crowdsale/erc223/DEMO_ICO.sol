pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/crowdsale/validation/WhitelistedCrowdsale.sol";

contract DEMO_ICO is WhitelistedCrowdsale{

    enum Stages {
        none,
        preICO,
        icoStart,
        icoEnd
    }

    Stages currentStage;
    uint256 public pricePreICO;
    uint256 public priceICO;

    constructor(address _wallet, ERC20 _token, uint256 _pricePreICO, uint256 _priceICO) public
    Crowdsale(1, _wallet, _token)
    {
        pricePreICO = _pricePreICO;
        priceICO = _priceICO;
        currentStage = Stages.none;
    }

    /**
     * @dev startIco starts the public ICO
     **/
    function startPreIco() public onlyOwner {
        require(currentStage == Stages.none);
        currentStage = Stages.preICO;
    }

    /**
     * @dev startIco starts the public ICO
     **/
    function startIco() public onlyOwner {
        require(currentStage != Stages.icoEnd);
        currentStage = Stages.icoStart;
    }

    /**
     * @dev finalizeIco closes down the ICO
     **/
    function finalizeIco() public onlyOwner {
        require(currentStage != Stages.icoEnd);
        currentStage = Stages.icoEnd;
    }

    function isOpen() public view returns (bool){
        return currentStage == Stages.preICO || currentStage == Stages.icoStart;
    }

    function _preValidatePurchase(
        address _beneficiary,
        uint256 _weiAmount
    )
    internal
    {
        require(isOpen(), "The ICO is not open");
        super._preValidatePurchase(_beneficiary, _weiAmount);
    }

    function _getTokenAmount(uint256 _weiAmount)
    internal view returns (uint256)
    {
        if(currentStage == Stages.preICO){
            return _weiAmount.div(pricePreICO);
        }else{
            return _weiAmount.div(priceICO);
        }
    }

    function _deliverTokens(
        address _beneficiary,
        uint256 _tokenAmount
    )
    internal
    {
        token.safeTransferFrom(owner, _beneficiary, _tokenAmount);
    }
}
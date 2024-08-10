//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./ERC4626Fees.sol";

contract Vault is ERC4626Fees  {
    address payable public vaultOwner;
    uint256 public entryFeeBasisPoints;
    address public immutable LOAN_CONTRACT_ADDRESS;
    mapping(address=>uint256) depositTime;
    mapping(address=>uint256) depositAmount;
    constructor(IERC20 _asset, uint256 _basisPoints,address _LOAN_CONTRACT_ADDRESS) ERC4626(_asset) ERC20("Vault USDC Token", "vUSDC"){
        vaultOwner = payable(msg.sender);
        entryFeeBasisPoints = _basisPoints;
        LOAN_CONTRACT_ADDRESS=_LOAN_CONTRACT_ADDRESS;
    }
function calculate_interest(address depositer) public  view returns  (uint256){
    uint256 monthsElapsed = (block.timestamp - depositTime[depositer])/(60*60*24*30);
    // calculating based on 12% per year 1% per month and 1/30 % per day
    require(monthsElapsed>0,"Withdraw only after one month");
    uint256 interest = (depositAmount[depositer]) * monthsElapsed / 100;
    return interest;
}
    function deposit(uint256 assets, address receiver) public virtual override returns (uint256) {
        require(assets <= maxDeposit(receiver), "ERC4626: deposit more than max");
        require(depositTime[msg.sender]==0,"Withdraw previous stake before increasing");
        uint256 shares = previewDeposit(assets);
        _deposit(_msgSender(), receiver, assets, shares);
        afterDeposit(assets,msg.sender);

        return shares;
    }

    function mint(uint256 shares, address receiver) public virtual override returns (uint256) {
        require(shares <= maxMint(receiver), "ERC4626: mint more than max");
        require(depositTime[msg.sender]==0,"Withdraw previous stake before increasing");
        uint256 assets = previewMint(shares);
        _deposit(_msgSender(), receiver, assets, shares);
        afterDeposit(assets,msg.sender);

        return assets;
    }

    function redeem(uint256 shares, address receiver, address owner) public virtual override returns (uint256) {
        require(shares <= maxRedeem(owner), "ERC4626: redeem more than max");
        require(depositTime[msg.sender] >0 && depositAmount[msg.sender]>0 , "Invest before withdraw");
        uint256 assets = previewRedeem(shares);
        uint256 interest=beforeWithdraw( msg.sender);
        _withdraw(_msgSender(), receiver, owner, assets+interest, shares);

        return assets;
    }
    function withdraw(uint256 assets, address receiver, address owner) public virtual override returns (uint256) {
        require(assets <= maxWithdraw(owner), "ERC4626: withdraw more than max");
        require(depositTime[msg.sender] >0 && depositAmount[msg.sender]>0 , "Invest before withdraw");
        uint256 shares = previewWithdraw(assets);
        uint256 interest = beforeWithdraw(msg.sender);
        _withdraw(_msgSender(), receiver, owner, assets+interest, shares);

        return shares;
    }

    function _entryFeeBasisPoints() internal view override returns (uint256) {
        return entryFeeBasisPoints;
    }

    function _entryFeeRecipient() internal view override returns (address) {
        return vaultOwner;
    }

    function afterDeposit(uint256 assets,address depositer) internal virtual {
        depositTime[depositer]=block.timestamp;
        depositAmount[depositer]=assets;
        SafeERC20.safeTransferFrom(IERC20(asset()),LOAN_CONTRACT_ADDRESS,address(this),assets/2); //50% for yield and 50% for liquidity
    }
    
    function beforeWithdraw(address depositer) internal virtual returns (uint256) {
        // calculate the interest of the depositor
        uint256 interest = calculate_interest(depositer);
        //reset the deposit amount and deposit timestamp mapping
        depositTime[depositer]=0;
        depositAmount[depositer]=0;
        // allow withdrawal by returning interest
        return interest ;
    }
}
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IERC20{
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);

}

contract Dispatcher {

address immutable public USDC_ADDRESS;

constructor(address _USDC_ADDRESS){
USDC_ADDRESS = _USDC_ADDRESS;
}

function send(address from,address to,uint256 amount) external {
    IERC20(USDC_ADDRESS).transferFrom(from, to, amount);
}

}
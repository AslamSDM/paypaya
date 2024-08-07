// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Create2.sol";


interface IERC20{
    function approve(address spender, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);

}

interface IDispatcher{
function send(address from,address to,uint256 amount) external ;
}

contract Account is IAccount{
    uint256 public count;
    address public owner;
    address public immutable USDC_ADDRESS;
    address public immutable DISPATCHER_ADDRESS;

    constructor(address _owner,address _usdc_address,address _dispatcher_address) {
        owner = _owner;
        USDC_ADDRESS=_usdc_address;
        DISPATCHER_ADDRESS =_dispatcher_address;
    }

    function validateUserOp(UserOperation calldata userOp, bytes32 userOpHash, uint256)
        external
        view
        returns (uint256 validationData)
    {
        address recovered = ECDSA.recover(ECDSA.toEthSignedMessageHash(userOpHash), userOp.signature);

        return owner == recovered ? 0 : 1;
    }
    
    function approveUSDC(address spender,uint256 amount) external{
        IERC20 USDC = IERC20(USDC_ADDRESS);
        USDC.approve(spender,amount);
    }

    function transferUSDC(uint256 amount, address reciever,address sender) external {
        IERC20 USDC = IERC20(USDC_ADDRESS);
        require(amount <= USDC.allowance(sender,DISPATCHER_ADDRESS),"Invalid allowance");
        IDispatcher dispatcher = IDispatcher(DISPATCHER_ADDRESS);   
        dispatcher.send(sender,reciever,amount);
    }

}

contract AccountFactory {
    function createAccount(address owner,address USDC_ADDRESS,address DISPATCHER_ADDRESS,bytes32 saltAppend) external returns (address) {
        bytes32 salt = bytes32(uint256(uint160(owner))) ^ saltAppend;
        bytes memory creationCode = type(Account).creationCode;
        bytes memory bytecode = abi.encodePacked(creationCode, abi.encode(owner,USDC_ADDRESS,DISPATCHER_ADDRESS));

        address addr = Create2.computeAddress(salt, keccak256(bytecode));
        uint256 codeSize = addr.code.length;
        if (codeSize > 0) {
            return addr;
        }

        return deploy(salt, bytecode);
    }

    function deploy(bytes32 salt, bytes memory bytecode) internal returns (address addr) {
        require(bytecode.length != 0, "Create2: bytecode length is zero");
        assembly {
            addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }
        require(addr != address(0), "Create2: Failed on deploy");
    }
}

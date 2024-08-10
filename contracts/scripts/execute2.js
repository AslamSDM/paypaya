const hre = require("hardhat");
const crypto = require("crypto")
const EPabi = require("./abiEP.json")
const ACCOUNT_FACTORY = "0xa8AccEb01bf6E9A1432f08eEF55E6d270E14aDe7"
const USDC_ADDRESS = "0xF8008eE43984a532e28A80C0a5e5bfad0f5c89b7"
const PAYMASTER_ADDRESS = "0xe3939F7157f5dFF3bFd4F0193C2afE807de98A0d"
const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const DISPATCHER_ADDRESS = "0xbc0bcE5a65C06dA8f653d66664d77F2123bD01a7"


function stringToBytes32(inputString) {
    const hash = crypto.createHash('sha256').update(inputString).digest('hex');
    
    const paddedHash = hash.padStart(64, '0');
    
    const bytes32 = '0x' + paddedHash;
    
    return bytes32;
}

const main = async () => {
    const privateKey = "0x212d9555aa109843a11e7c2239f30c863b4cd1af4756c1ed1fc270b3df82b127";
    // const privateKey = "0xae1c82de859407ab3d6f276ae4424b6230b1c2bef607a1e9d836619da064fea4";
    const provider = new hre.ethers.AlchemyProvider("sepolia", "zb48VfBh1apnZNVgh9TnHP3lo3NUfqmo")
    const signer0 = new hre.ethers.Wallet(privateKey, provider);
    const address0 = signer0.address


    const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
    const entryPoint = await hre.ethers.getContractAt(EPabi, EP_ADDRESS, signer0)
    entryPoint.connect(signer0)
    const saltAppend=stringToBytes32("8301062633")
    console.log(saltAppend)
    let initCode = ACCOUNT_FACTORY + (AccountFactory.interface.encodeFunctionData("createAccount", [address0, USDC_ADDRESS, DISPATCHER_ADDRESS,saltAppend])).slice(2)
    let sender;
    try {

        await entryPoint.getSenderAddress(initCode);
    } catch (ex) {
        sender = "0x" + ex.data.slice(-40);
    }
    const code = await ethers.provider.getCode(sender);
    if (code !== "0x") {
        initCode = "0x";
    }
    console.log({ sender });
    const Account = await hre.ethers.getContractFactory("Account");
    console.log(Account)
    const userOp = {
        sender,
        nonce: "0x" + (await entryPoint.getNonce(sender, 0)).toString(16),
        initCode,
        callData: Account.interface.encodeFunctionData("transferUSDC", [BigInt(10 * 10 ** 18),"0xa384b3b69E6ACDa003a3093B3CA68938A3055704",sender]),
        // callData: Account.interface.encodeFunctionData("approveUSDC", [DISPATCHER_ADDRESS, BigInt(1000 * 10 ** 18)]),
        paymasterAndData: PAYMASTER_ADDRESS,
        signature:
            "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
    };

    const { preVerificationGas, verificationGasLimit, callGasLimit } =
        await ethers.provider.send("eth_estimateUserOperationGas", [
            userOp,
            EP_ADDRESS,
        ]);
    userOp.preVerificationGas = preVerificationGas;
    userOp.verificationGasLimit = verificationGasLimit;
    userOp.callGasLimit = callGasLimit;

    const { maxFeePerGas } = await ethers.provider.getFeeData();
    userOp.maxFeePerGas = "0x" + maxFeePerGas.toString(16);
    const maxPriorityFeePerGas = await ethers.provider.send(
        "rundler_maxPriorityFeePerGas"
    );
    userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;
    const userOpHash = await entryPoint.getUserOpHash(userOp);
    userOp.signature = await signer0.signMessage(hre.ethers.getBytes(userOpHash));

    const opHash = await ethers.provider.send("eth_sendUserOperation", [
        userOp,
        EP_ADDRESS,
    ]);

    setTimeout(async () => {
        const { transactionHash } = await ethers.provider.send(
            "eth_getUserOperationByHash",
            [opHash]
        )
        console.log(transactionHash);
    }, 10000);
}



main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
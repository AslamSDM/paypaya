const hre = require("hardhat");
const EPabi = require("./abiEP.json")
const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PM_ADDRESS = "0xe3939F7157f5dFF3bFd4F0193C2afE807de98A0d";

async function main() {
  const privateKey = "0xae1c82de859407ab3d6f276ae4424b6230b1c2bef607a1e9d836619da064fea4";
  const provider = new hre.ethers.AlchemyProvider("sepolia", "zb48VfBh1apnZNVgh9TnHP3lo3NUfqmo")
  const signer0 = new hre.ethers.Wallet(privateKey, provider);
  const entryPoint = new hre.ethers.Contract(EP_ADDRESS,EPabi,signer0)

  await entryPoint.depositTo(PM_ADDRESS, {
    value: hre.ethers.parseEther(".1"),
  });

  console.log("deposit was successful!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

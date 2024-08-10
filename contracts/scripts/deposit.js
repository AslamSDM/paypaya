const hre = require("hardhat");
const EPabi = require("./abiEP.json")
const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PM_ADDRESS = "0x4c825a52d6a77d22dc38Da3A09F15708547EB26D";

async function main() {
  const privateKey = "0xae1c82de859407ab3d6f276ae4424b6230b1c2bef607a1e9d836619da064fea4";
  const provider = new hre.ethers.AlchemyProvider("optimism-sepolia", "zb48VfBh1apnZNVgh9TnHP3lo3NUfqmo")
  const signer0 = new hre.ethers.Wallet(privateKey, provider);
  const entryPoint = new hre.ethers.Contract(EP_ADDRESS,EPabi,signer0)

  await entryPoint.depositTo(PM_ADDRESS, {
    value: hre.ethers.parseEther(".07"),
  });

  console.log("deposit was successful!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

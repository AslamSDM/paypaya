const hre = require("hardhat");

async function main() {
  const Disptcher = await hre.ethers.deployContract("Vault",["0x4c825a52d6a77d22dc38Da3A09F15708547EB26D",100]);

  await Disptcher.waitForDeployment();

  console.log(`Vault contract deployed to ${Disptcher.target}`);

  // const pm = await hre.ethers.deployContract("Paymaster");

  // await pm.waitForDeployment();

  // console.log(`PM deployed to ${pm.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

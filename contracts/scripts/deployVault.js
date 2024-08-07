const hre = require("hardhat");

async function main() {
  const Disptcher = await hre.ethers.deployContract("Vault",["0x378883c3CB137f18a1d3Fc32385cd76f952139E3",100,"0x4c825a52d6a77d22dc38Da3A09F15708547EB26D"]);

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

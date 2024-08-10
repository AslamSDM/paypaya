const hre = require("hardhat");

async function main() {
  const PM = await hre.ethers.deployContract("Paymaster");

  await PM.waitForDeployment();

  console.log(`PM deployed to ${PM.target}`);

  // const pm = await hre.ethers.deployContract("Paymaster");

  // await pm.waitForDeployment();

  // console.log(`PM deployed to ${pm.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

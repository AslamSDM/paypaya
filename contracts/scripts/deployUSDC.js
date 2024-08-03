const hre = require("hardhat");

async function main() {
  const USDC = await hre.ethers.deployContract("USDC",);

  await USDC.waitForDeployment();

  console.log(`USDC deployed to ${USDC.target}`);

  // const pm = await hre.ethers.deployContract("Paymaster");

  // await pm.waitForDeployment();

  // console.log(`PM deployed to ${pm.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

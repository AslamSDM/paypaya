const hre = require("hardhat");

async function main() {
  const Disptcher = await hre.ethers.deployContract("AttesterResolver",["0x4200000000000000000000000000000000000021","0xdf79a13d5d6ccca1d1a0e67ecf1d1fb17658e80a"]);

  await Disptcher.waitForDeployment();

  console.log(`AttesterResolver contract deployed to ${Disptcher.target}`);

  // const pm = await hre.ethers.deployContract("Paymaster");

  // await pm.waitForDeployment();

  // console.log(`PM deployed to ${pm.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

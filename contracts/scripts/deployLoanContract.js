const hre = require("hardhat");

async function main() {
  const Disptcher = await hre.ethers.deployContract("Loan",["0xdf79a13d5d6ccca1d1a0e67ecf1d1fb17658e80a","0x378883c3CB137f18a1d3Fc32385cd76f952139E3"]);

  await Disptcher.waitForDeployment();

  console.log(`Loan contract deployed to ${Disptcher.target}`);

  // const pm = await hre.ethers.deployContract("Paymaster");

  // await pm.waitForDeployment();

  // console.log(`PM deployed to ${pm.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

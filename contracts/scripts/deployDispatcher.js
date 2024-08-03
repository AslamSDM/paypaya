const hre = require("hardhat");

async function main() {
  const Disptcher = await hre.ethers.deployContract("Dispatcher",["0xF8008eE43984a532e28A80C0a5e5bfad0f5c89b7"]);

  await Disptcher.waitForDeployment();

  console.log(`Disptcher deployed to ${Disptcher.target}`);

  // const pm = await hre.ethers.deployContract("Paymaster");

  // await pm.waitForDeployment();

  // console.log(`PM deployed to ${pm.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

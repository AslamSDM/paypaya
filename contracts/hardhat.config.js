require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomicfoundation/hardhat-verify");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/zb48VfBh1apnZNVgh9TnHP3lo3NUfqmo",
      accounts: ["ae1c82de859407ab3d6f276ae4424b6230b1c2bef607a1e9d836619da064fea4"],
    },
  },
  etherscan:{
    apiKey:"RXXQDGVDBS5KTT2DRKAWMBW669DAIKI655"
  },
  sourcify:{
    enabled:true
  },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
};

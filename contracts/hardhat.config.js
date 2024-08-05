require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomicfoundation/hardhat-verify");
const deployerPrivateKey = "ae1c82de859407ab3d6f276ae4424b6230b1c2bef607a1e9d836619da064fea4"
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/zb48VfBh1apnZNVgh9TnHP3lo3NUfqmo",
      accounts: [deployerPrivateKey],
      chainId:11155420
    },
    mode: {
      url: "https://sepolia.mode.network",
      chainId: 919,
      accounts: [deployerPrivateKey] //BE VERY CAREFUL, DO NOT PUSH THIS TO GITHUB
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [deployerPrivateKey],
    },
    optimismSepolia: {
      url: `https://opt-sepolia.g.alchemy.com/v2/zb48VfBh1apnZNVgh9TnHP3lo3NUfqmo`,
      accounts: [deployerPrivateKey],
    },   
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [deployerPrivateKey],
      chainId: 44787
    },
    cel2:{
      url:"https://forno.dango.celo-testnet.org/",
      accounts:[deployerPrivateKey],
      chainId:44787
    },
    fraxtal:{
      url:"https://rpc.frax.com",
      accounts:[deployerPrivateKey],
      chainId:252
    },
    metal:{
      url:"https://testnet.rpc.metall2.com/",
      accounts:[deployerPrivateKey],
      chainId:1740
    }
  },
  etherscan: {
    apiKey: {
      // Is not required by blockscout. Can be any non-empty string
      'optimismSepolia': "abc",
      "mode":"abc",
      'baseSepolia': "abc",
      'sepolia': "abc",
      'alfajores': "abc",
      'fraxtal': "abc",
      'cel2': "abc",
     'metal': "abc"

    },
    customChains: [
      {
        network: "optimismSepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://optimism-sepolia.blockscout.com/api",
          browserURL: "https://optimism-sepolia.blockscout.com/",
        }
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://base-sepolia.blockscout.com/api",
          browserURL: "https://base-sepolia.blockscout.com/",
        }
      },

      {
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://eth-sepolia.blockscout.com/api/",
          browserURL: "https://eth-sepolia.blockscout.com/",
        }
      },
      {
        network: "mode",
        chainId: 919,
        urls: {
          apiURL: "https://sepolia.explorer.mode.network/api",
          browserURL: "https://sepolia.explorer.mode.network/",
        }
      },
      {
        network: "alfajores",
        chainId: 44787,
        urls: {
          apiURL: "https://explorer.celo.org/alfajores/api",
          browserURL: "https://explorer.celo.org/alfajores",
        }
      },
      {
        network: "cel2",
        chainId: 44787,
        urls: {
          apiURL: "https://celo-dango.blockscout.com/api/",
          browserURL: "https://celo-dango.blockscout.com/",
        }
      },
      {
        network: "fraxtal",
        chainId: 252,
        urls: {
          apiURL: "https://optimism-sepolia.blockscout.com/api",
          browserURL: "https://optimism-sepolia.blockscout.com/",
        }
      },
      {
        network: "metal",
        chainId: 1740,
        urls: {
          apiURL: "https://optimism-sepolia.blockscout.com/api",
          browserURL: "https://optimism-sepolia.blockscout.com/",
        }
      }
    ]
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


// npx hardhat verify --network alfajores 0x100d00E65cb4033A8B3236AB8697F8a2F226C6C1 "0x378883c3CB137f18a1d3Fc32385cd76f952139E3" "100" "0x4c825a52d6a77d22dc38Da3A09F15708547EB26D"
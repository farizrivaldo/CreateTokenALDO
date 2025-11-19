require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox"); // toolbox sudah termasuk etherscan

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,       // Contoh: Alchemy / Infura / QuickNode
      accounts: [process.env.PRIVATE_KEY] // Private key deployer
    },
    // tambahkan network lain jika perlu
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};

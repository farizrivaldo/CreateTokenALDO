const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying ALDO DeFi Ecosystem to Sepolia...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("🔑 Deploying with account:", deployer.address);

  // Token yang sudah di-deploy sebelumnya
  const tokenAddress = "0xDB9ba19139D849A3E509F0D5e20536C4821e975e";
  console.log("📍 Using existing ALDO Token:", tokenAddress);

  // Deploy Ecosystem Contract
  console.log("\n📝 Deploying ALDO Ecosystem...");
  const ALDOEcosystem = await ethers.getContractFactory("ALDOEcosystem");
  const ecosystem = await ALDOEcosystem.deploy(tokenAddress);
  await ecosystem.waitForDeployment();
  const ecosystemAddress = await ecosystem.getAddress();
  console.log("✅ ALDO Ecosystem deployed to:", ecosystemAddress);

  console.log("\n===========================================");
  console.log("🎉 DEPLOYMENT SUCCESSFUL!");
  console.log("===========================================");
  console.log("📍 ALDO Token Address:", tokenAddress);
  console.log("📍 Ecosystem Address:", ecosystemAddress);
  console.log("===========================================");
  console.log("\n⚠️  IMPORTANT NEXT STEPS:");
  console.log("1. Update ECOSYSTEM_ADDRESS in contracts.jsx:");
  console.log(`   ECOSYSTEM_ADDRESS: "${ecosystemAddress}"`);
  console.log("\n2. Approve Ecosystem contract untuk transfer token:");
  console.log("   - Mint token untuk rewards pool");
  console.log("   - Approve ecosystem contract");
  console.log("\n3. Verify on Etherscan:");
  console.log("   npx hardhat verify --network sepolia " + ecosystemAddress + " " + tokenAddress);
  console.log("\n✅ Happy Staking! 🎉");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
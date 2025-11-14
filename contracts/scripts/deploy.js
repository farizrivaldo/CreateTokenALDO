const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying ALDO Token and Marketplace to Sepolia...\n");

  // Deploy ALDO Token
  console.log("📝 Deploying ALDO Token...");
  const ALDOToken = await hre.ethers.getContractFactory("ALDOToken");
  const aldoToken = await ALDOToken.deploy();
  await aldoToken.waitForDeployment(); // ✅ NEW: waitForDeployment instead of deployed
  const tokenAddress = await aldoToken.getAddress(); // ✅ NEW: getAddress instead of .address
  console.log("✅ ALDO Token deployed to:", tokenAddress);

  // Deploy Marketplace
  console.log("\n📝 Deploying ALDO Marketplace...");
  const ALDOMarketplace = await hre.ethers.getContractFactory("ALDOMarketplace");
  const marketplace = await ALDOMarketplace.deploy(tokenAddress);
  await marketplace.waitForDeployment(); // ✅ NEW: waitForDeployment
  const marketplaceAddress = await marketplace.getAddress(); // ✅ NEW: getAddress
  console.log("✅ ALDO Marketplace deployed to:", marketplaceAddress);

  console.log("\n===========================================");
  console.log("🎉 DEPLOYMENT SUCCESSFUL!");
  console.log("===========================================");
  console.log("📍 ALDO Token Address:", tokenAddress);
  console.log("📍 Marketplace Address:", marketplaceAddress);
  console.log("===========================================");
  console.log("\n⚠️  IMPORTANT NEXT STEPS:");
  console.log("1. Copy addresses above");
  console.log("2. Update src/utils/contracts.js");
  console.log("3. Update .env file");
  console.log("4. Verify on Sepolia Etherscan:");
  console.log("   https://sepolia.etherscan.io/address/" + tokenAddress);
  console.log("   https://sepolia.etherscan.io/address/" + marketplaceAddress);
  console.log("\n✅ Run: npm start");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
const hre = require("hardhat");

// ABI untuk ALDOToken (functions yang dibutuhkan saja)
const TOKEN_ABI = [
  "function owner() view returns (address)",
  "function balanceOf(address) view returns (uint256)",
  "function mint(address to, uint256 amount)",
  "function approve(address spender, uint256 amount) returns (bool)"
];

// ABI untuk ALDOEcosystem
const ECOSYSTEM_ABI = [
  "function depositRewards(uint256 amount)"
];

async function main() {
  // Get addresses
  const ecosystemAddress = process.argv[2] || "0xFc041ecbaC08fD33c73266a60cBa673C15d5b4E4";
  const tokenAddress = "0xDB9ba19139D849A3E509F0D5e20536C4821e975e";
  
  console.log("🎁 Setting up Rewards Pool...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("🔑 Using account:", deployer.address);

  // Connect to contracts using ABI
  const aldoToken = new hre.ethers.Contract(tokenAddress, TOKEN_ABI, deployer);
  const ecosystem = new hre.ethers.Contract(ecosystemAddress, ECOSYSTEM_ABI, deployer);

  // Check if deployer is token owner
  const tokenOwner = await aldoToken.owner();
  console.log("📍 Token owner:", tokenOwner);
  
  if (tokenOwner.toLowerCase() !== deployer.address.toLowerCase()) {
    console.error("\n❌ You are not the token owner!");
    console.error("   This script must be run by:", tokenOwner);
    console.error("\n💡 Solution:");
    console.error("   1. Use the private key of the token owner");
    console.error("   2. Or ask the token owner to run this script\n");
    process.exit(1);
  }

  // Setup rewards
  const rewardsAmount = hre.ethers.parseEther("100000"); // 100k ALDO
  
  console.log("\n📝 Step 1: Minting rewards tokens...");
  const mintTx = await aldoToken.mint(deployer.address, rewardsAmount);
  console.log("   TX Hash:", mintTx.hash);
  await mintTx.wait();
  console.log("✅ Minted 100,000 ALDO");
  
  console.log("\n📝 Step 2: Approving ecosystem contract...");
  const approveTx = await aldoToken.approve(ecosystemAddress, rewardsAmount);
  console.log("   TX Hash:", approveTx.hash);
  await approveTx.wait();
  console.log("✅ Approved ecosystem to spend tokens");
  
  console.log("\n📝 Step 3: Depositing rewards...");
  const depositTx = await ecosystem.depositRewards(rewardsAmount);
  console.log("   TX Hash:", depositTx.hash);
  await depositTx.wait();
  console.log("✅ Deposited 100,000 ALDO to rewards pool");

  // Verify
  const ecosystemBalance = await aldoToken.balanceOf(ecosystemAddress);
  
  console.log("\n" + "=".repeat(60));
  console.log("🎉 SETUP COMPLETE!");
  console.log("=".repeat(60));
  console.log("\n📊 REWARDS POOL STATUS:");
  console.log("   Ecosystem Balance:", hre.ethers.formatEther(ecosystemBalance), "ALDO");
  console.log("\n✅ Users can now:");
  console.log("   • Stake tokens and earn rewards");
  console.log("   • Participate in governance");
  console.log("   • Claim vesting schedules");
  console.log("   • Claim airdrops");
  console.log("\n🌐 View on Etherscan:");
  console.log("   Token:     https://sepolia.etherscan.io/address/" + tokenAddress);
  console.log("   Ecosystem: https://sepolia.etherscan.io/address/" + ecosystemAddress);
  console.log("\n" + "=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ SETUP FAILED\n");
    console.error(error);
    process.exit(1);
  });
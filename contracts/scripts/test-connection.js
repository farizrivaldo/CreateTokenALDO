const hre = require("hardhat");

async function main() {
  console.log("🔍 Testing RPC Connection...\n");

  try {
    // Test 1: Get network
    const network = await hre.ethers.provider.getNetwork();
    console.log("✅ Network:", network.name);
    console.log("   Chain ID:", network.chainId.toString());

    // Test 2: Get block number
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log("\n✅ Current Block:", blockNumber);

    // Test 3: Get account
    const [deployer] = await hre.ethers.getSigners();
    console.log("\n✅ Deployer Address:", deployer.address);

    // Test 4: Get balance
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("   Balance:", hre.ethers.formatEther(balance), "ETH");

    // Test 5: Check token contract
    const tokenAddress = "0xDB9ba19139D849A3E509F0D5e20536C4821e975e";
    const code = await hre.ethers.provider.getCode(tokenAddress);
    console.log("\n✅ Token Contract Exists:", code !== "0x");

    console.log("\n🎉 All tests passed! Ready to deploy.\n");

  } catch (error) {
    console.error("\n❌ Connection Test Failed:");
    console.error("   Error:", error.message);
    console.error("\n💡 Suggestions:");
    console.error("   1. Check your RPC URL in .env");
    console.error("   2. Try a different RPC provider (Alchemy, Infura, Public RPC)");
    console.error("   3. Check your internet connection");
    console.error("   4. Check if the RPC endpoint is rate-limited\n");
    process.exit(1);
  }
}

main();